import { Response, Request, NextFunction } from "express";
import passport from "passport";
import { MongoError } from "mongodb";
import { QueryOptions } from "mongoose";
import { body, validationResult } from "express-validator";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
import { IUser } from "../types/user";
import User from "../models/userModel";

// Get info about a particular user
exports.get_user = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.id, { username: 1 }).exec((err, user) => {
    if (err) {
      return next(err);
    }
    res.json({ user });
  });
};

// Log in
exports.login_user = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 25 })
    .escape()
    .withMessage("User name must be between 3 and 25 characters long"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    // if validation didn't succeed
    if (!errors.isEmpty()) {
      // Return errors
      res.json({ errors: errors.array() });
      return;
    }

    passport.authenticate(
      "local",
      { session: false },
      (err: MongoError, user: IUser) => {
        if (err || !user) {
          return res.status(400).json({
            message: "Something is not right",
            user: user,
          });
        }
        req.login(user, { session: false }, (loginErr: any) => {
          if (loginErr) {
            res.send(loginErr);
          }
          // generate a signed son web token with the contents of user object and return it in the response
          // user must be converted to JSON
          jwt.sign(
            user.toJSON(),
            process.env.AUTH_SECRET,
            { expiresIn: "24h" },
            (signErr: any, token: string) => {
              if (signErr) {
                return next(signErr);
              }
              return res.json({ user, token });
            }
          );
        });
      }
    )(req, res);
  }
];

// Sign user up
exports.create_user = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 25 })
    .escape()
    .withMessage("User name must be between 3 and 25 characters long"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("passwordConfirm")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords don't match!"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    // if validation didn't succeed
    if (!errors.isEmpty()) {
      // Return errors
      res.json({ errors: errors.array() });
      return;
    }

    // If its valid
    // encrypt password
    bcrypt.hash(
      req.body.password,
      10,
      (err: MongoError, hashedPassword: string) => {
        if (err) {
          return next(err);
        }
        // look if username already exists
        User.find({ username: req.body.username }).exec(
          (userErr, user: IUser[]) => {
            if (user.length !== 0) {
              // return error and user data filled so far
              res.json({ error: "Username already exists", user: req.body });
            } else {
              // Create new user
              const newUser = new User({
                username: req.body.username,
                password: hashedPassword,
                permission: "regular",
              });
              newUser.save((userSaveErr) => {
                if (userSaveErr) {
                  return next(userSaveErr);
                }
                // generate a signed son web token with the contents of user object and return it in the response
                // user must be converted to JSON
                jwt.sign(
                  newUser.toJSON(),
                  process.env.AUTH_SECRET,
                  { expiresIn: "24h" },
                  (signErr: any, token: string) => {
                    if (signErr) {
                      return next(signErr);
                    }
                    return res.json({ user: newUser, token });
                  }
                );
              });
            }
          }
        );
      }
    );
  },
];

// Update a single user
exports.update_user = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 25 })
    .escape()
    .withMessage("User name must be between 3 and 25 characters long"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("passwordConfirm")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords don't match!"),
  body("permission", "User permission is required")
    .trim()
    .isIn(["regular", "admin"])
    .withMessage("User permission can only be regular or admin"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    // if validation didn't succeed
    if (!errors.isEmpty()) {
      // Return errors
      res.json({ errors: errors.array() });
      return;
    }

    // If its valid
    // encrypt password
    bcrypt.hash(
      req.body.password,
      10,
      (err: MongoError, hashedPassword: string) => {
        if (err) {
          return next(err);
        }
        // Create new user
        const newUser = new User({
          username: req.body.username,
          password: hashedPassword,
          permission: req.body.permission,
          _id: req.params.id,
        });

        // option to return updated post
        const updateOption: QueryOptions & { rawResult: true } = {
          new: true,
          upsert: true,
          rawResult: true,
        };

        // update user in database
        User.findByIdAndUpdate(
          req.params.id,
          newUser,
          updateOption,
          (updateErr, updatedUser) => {
            if (updateErr) {
              return next(updateErr);
            }
            // generate a signed son web token with the contents of user object and return it in the response
            // user must be converted to JSON
            jwt.sign(
              newUser.toJSON(),
              process.env.AUTH_SECRET,
              { expiresIn: "24h" },
              (signErr: any, token: string) => {
                if (signErr) {
                  return next(signErr);
                }
                return res.json({ user: updatedUser.value, token });
              }
            );
          }
        );
      }
    );
  },
];

// Delete a single user
exports.delete_user = (req: Request, res: Response, next: NextFunction) => {
  User.findByIdAndDelete(req.params.id, (err: MongoError) => {
    if (err) {
      return next(err);
    }
    res.json({ response: `deleted user ${req.params.id}` });
  });
};
