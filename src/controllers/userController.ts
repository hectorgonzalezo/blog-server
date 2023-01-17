import { Response, Request, NextFunction } from "express";
import passport from "passport";
import { MongoError } from "mongodb";
import { QueryOptions } from "mongoose";
import { body, validationResult } from "express-validator";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
import { IUser } from "../types/user";
import User from "../models/userModel";

const EXPIRATION = "24h";

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
      return res.json({ errors: errors.array() });
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
            return res.send(loginErr);
          }
          // generate a signed son web token with the contents of user object and return it in the response
          // user must be converted to JSON
          const token =  jwt.sign(
            user.toJSON(),
            process.env.AUTH_SECRET);
          return res.json({ user, token });
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
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    // if validation didn't succeed
    if (!errors.isEmpty()) {
      // Return errors
      res.status(400).send({ errors: errors.array() });
      return;
    }

    // If its valid
    // encrypt password
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      // look if username already exists
      const existingUser = await User.find({ username: req.body.username });
      if (existingUser.length !== 0) {
        // return error and user data filled so far
        return res.status(400).send({
          errors: [{ msg: "Username already exists", user: req.body }],
        });
      }
      // Create new user
      const newUser = new User({
        username: req.body.username,
        password: hashedPassword,
        permission: "regular",
      });
      const user = await newUser.save();
      // generate a signed son web token with the contents of user object and return it in the response
      // user must be converted to JSON
      const token = jwt.sign(newUser.toJSON(), process.env.AUTH_SECRET);
      return res.json({ user: newUser, token });
    } catch (err) {
      return next(err);
    }
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
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    // if validation didn't succeed
    if (!errors.isEmpty()) {
      // Return errors
      res.json({ errors: errors.array() });
      return;
    }

    // If its valid
    // encrypt password
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      // Create new user
      const newUser = new User({
        username: req.body.username,
        password: hashedPassword,
        permission: req.body.permission,
      });
      // option to return updated post
      const updateOption: QueryOptions & { rawResult: true } = {
        new: true,
        upsert: true,
        rawResult: true,
      };
      const user = await User.findByIdAndUpdate(
        req.params.id,
        newUser,
        updateOption
      );
      // generate a signed son web token with the contents of user object and return it in the response
      // user must be converted to JSON
      const token = jwt.sign(newUser.toJSON(), process.env.AUTH_SECRET);
      return res.json({ user: newUser, token });
    } catch (err) {
      return next(err);
    }
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
