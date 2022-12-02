import express, { Request, Response, NextFunction } from "express";
import passport from "passport";
const userController = require("../controllers/userController");
import { IUser } from "../types/user";
require("../passport");

const router = express.Router();

// Log in
router.post("/log-in", userController.login_user);

//Individual user CRUD operations
// Read
// Only get users if you're authorized
router.get(
  "/:id",
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "jwt",
      { session: false },
      (err: any, user: IUser) => {
        if (err) {
          return next(err);
        }
        // Only show users if user is administrator
        if (user.permission === "admin") {
          next();
        } else {
          // if user is not admin, return error
          res.status(403).send({
            error: "Only administrators can get info about users",
          });
        }
      }
    )(req, res, next);
  },
  userController.get_user
);

// create, sign up
router.post("/sign-up", userController.create_user);

// update
router.put(
  "/:id",
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "jwt",
      { session: false },
      (err: any, user: IUser) => {
        if (err) {
          return next(err);
        }
        // Only update if user is administrator or the owner
        if (
          user.permission === "admin" ||
          user._id.toString() === req.params.id
        ) {
          next();
        } else {
          // if user is not admin, return error
          res.status(403).send({
            error: "Only administrators or the user itself can update a user",
          });
        }
      }
    )(req, res, next);
  },
  userController.update_user
);

// delete
// Only delete users if you're authorized
router.delete(
  "/:id",
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "jwt",
      { session: false },
      (err: any, user: IUser) => {
        if (err) {
          return next(err);
        }
        // Only delete users if user is administrator
        if (user.permission === "admin") {
          next();
        } else {
          // if user is not admin, return error
          res.status(403).send({
            error: "Only administrators can delete users",
          });
        }
      }
    )(req, res, next);
  },
  userController.delete_user
);

module.exports = router;
