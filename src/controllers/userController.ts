import { Response, Request, NextFunction } from "express";
import passport from 'passport';
import { MongoError } from 'mongodb';
import { body, validationResult } from 'express-validator';
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
exports.login_user = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "local",
    { session: false },
    (err: MongoError, user: IUser, info: any) => {
      if (err || !user) {
        console.log({ err, user })
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
        jwt.sign(user.toJSON(), process.env.AUTH_SECRET, {}, (signErr: any, token: string) => {
          if (signErr) {
            return next(signErr);
          }
          return res.json({ user, token });
        }
        )
      });
    }
  )(req, res);
};

// log out
exports.logout_user = (req: Request, res: Response) => {
  res.json({ response: 'logout user' });
}; 

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
    bcrypt.hash(req.body.password, 10, (err: MongoError, hashedPassword: string) => {
      if (err) {
        return next(err);
      }
      
      // look if username already exists
      User.find({ username: req.body.username }).exec((userErr, user: IUser[]) => {
        if (user.length !== 0) {
          // return error and user data filled so far
          res.json({ error: "Username already exists", user: req.body });
        } else {
          // Create new user
          const newUser = new User({
            username: req.body.username,
            password: hashedPassword,
            membershipStatus: "regular",
          });
          newUser.save((userSaveErr) => {
            if (userSaveErr) {
              return next(userSaveErr);
            }
            res.json({ user: newUser });
          });
        }
      });
    });
  },
];


exports.update_user = (req: Request, res: Response) => {
  res.json({ response: 'update user' + req.params.userId  });
};


exports.delete_user = (req: Request, res: Response) => {
  res.json({ response: 'delete user' + req.params.userId  });
};

