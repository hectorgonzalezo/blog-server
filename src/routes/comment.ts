import express, { Request, Response, NextFunction } from "express";
import { IUser } from "../types/user";
const passport = require("passport");
import Comment from "../models/commentModel";
import { IComment } from "../types/comment";
const commentController = require("../controllers/commentController");

const router = express.Router();

// Get all comments in a particular post
router.get("/", commentController.get_all_comments);

//Individual comment CRUD operations
// Read
router.get("/:id", commentController.get_comment);

// create
// only if user is logged in
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  commentController.create_comment
);

// update
// only if logged in user is the commenter
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
        Comment.findById(req.params.id).exec(
          (findErr, comment: IComment | null) => {
            if (findErr) {
              return next(findErr);
            }
            // Only update if user is administrator or the commenter
            if (
              user.permission === "admin" ||
              (comment && comment.commenter.toString() === user._id.toString())
            ) {
              next();
            } else {
              // if user is not admin, return error
              res.status(403).send({
                error:
                  "Only administrators or the user itself can update a comment",
              });
            }
          }
        );
      }
    )(req, res, next);
  },
  commentController.update_comment
);

// delete
// only if logged in user is the commenter
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
        Comment.findById(req.params.id).exec(
          (findErr, comment: IComment | null) => {
            if (findErr) {
              return next(findErr);
            }
            // Only delete if user is administrator or the commenter
            if (
              user.permission === "admin" ||
              (comment && comment.commenter.toString() === user._id.toString())
            ) {
              next();
              
            } else {
              // if user is not admin, return error
              res.status(403).send({
                error:
                  "Only administrators or the user itself can delete a comment",
              });
            }
          }
        );
      }
    )(req, res, next);
  },
  commentController.delete_comment
);

module.exports = router;
