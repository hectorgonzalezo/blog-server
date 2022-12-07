import express, { Request, Response, NextFunction } from "express";
import { IUser } from "../types/user";
const passport = require("passport");
const postController = require("../controllers/postController");

const router = express.Router();

// Get all posts
router.get("/", postController.get_all_posts);

//Individual post CRUD operations
// Read
router.get("/:id", postController.get_post);

// create
router.post(
  "/",
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "jwt",
      { session: false },
      (err: any, user: IUser) => {
        if (err) {
          return next(err);
        }
        // Only create post if user is administrator
        if (user.permission === "admin") {
          next();
        } else {
          // if user is not admin, return error
          res.status(403).send({
            error: "Only administrators can create a post",
          });
        }
      }
    )(req, res, next);
  },
  postController.create_post
);

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
        // Only update post if user is administrator
        if (user.permission === "admin") {
          next();
        } else {
          // if user is not admin, return error
          res.status(403).send({
            error: "Only administrators can update a post",
          });
        }
      }
    )(req, res, next);
  },
  postController.update_post
);

// delete
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
        console.log(user);
        // Only delete post if user is administrator
        if (user.permission === "admin") {
          next();
        } else {
          // if user is not admin, return error
          res.status(403).send({
            error: "Only administrators can delete a post",
          });
        }
      }
    )(req, res, next);
  },
  postController.delete_post
);

module.exports = router;
