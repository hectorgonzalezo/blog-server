import { Response, Request, NextFunction } from "express";
import { MongoError } from "mongodb";
import { QueryOptions } from "mongoose";
import { ExtendedRequest } from "../types/extendedRequest";
import { body, validationResult } from "express-validator";
import { IComment } from "../types/comment";
import Comment from "../models/commentModel";
import { IPost } from "../types/post";
import Post from "../models/postModel";

const COMMENTERID = "6387b1034b273a93bba9303e";

// Reads return the comment
// Creates, updates and deletes return the updated post

// Get all comments in a particular post
exports.get_all_comments = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  Comment.find({ post: req.postId })
    .sort({ createdAt: 1 })
    .populate("commenter", "username")
    .exec((err, comments: IComment[]) => {
      if (err) {
        return next(err);
      }
      res.json({ comments });
    });
};

// Create a single comment
exports.create_comment = [
  body("content", "Blog content is required")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Blog content can't be empty")
    .escape(),
  body("poster", "Blog commenter is required").trim().escape(),
  (req: ExtendedRequest, res: Response, next: NextFunction) => {
    // get validation errors
    const errors = validationResult(req);
    // If there are errors, return body
    if (!errors.isEmpty()) {
      // There are errors, send them via json
      res.json({ errors: errors.array() });
    }
    // If data is valid
    // Create new comment
    const reqBody = req.body as Pick<
      IComment,
      "content" | "published" | "poster" | "post"
    >;
    const newComment: IComment = new Comment({
      content: reqBody.content,
      published: reqBody.published,
      // Change commenter id from hardcoded
      commenter: COMMENTERID,
      post: req.postId,
    });
    newComment.save((err) => {
      if (err) {
        return next(err);
      }
      // option to return updated post
      const updateOption: QueryOptions & { rawResult: true } = {
        new: false,
        upsert: true,
        rawResult: true,
      };
      // add comment to post
      Post.findByIdAndUpdate(
        req.postId,
        { $push: { comments: newComment } },
        updateOption,
        (updateErr, updatedPost) => {
          if (updateErr) {
            return next(updateErr);
          }

          // find post again so that it can populate the comments
          Post.findById(req.postId)
            .populate({
              path: "comments",
              populate: { path: "commenter", select: "username" },
            })
            .exec((postErr, post) => {
              if (postErr) {
                return next(postErr);
              }
              // if successful send updated post
              res.json({ post });
            });
        }
      );
    });
  },
];

// Get a single comment
exports.get_comment = (req: Request, res: Response, next: NextFunction) => {
  Comment.findById(req.params.id)
    .populate("commenter", "username")
    .exec((err, comment) => {
      if (err) {
        return next(err);
      }
      res.json({ comment });
    });
};

// update existing comment
exports.update_comment = [
  body("content", "Blog content is required")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Blog content can't be empty")
    .escape(),
  body("commenter", "Blog commenter is required").trim().escape(),
  (req: ExtendedRequest, res: Response, next: NextFunction) => {
    // get validation errors
    const errors = validationResult(req);
    // If there are errors, return body
    if (!errors.isEmpty()) {
      // There are errors, return json with errors array
      res.json({ errors: errors.array() });
      return;
    }
    // If data is valid
    // Create new comment
    const reqBody = req.body as Pick<
      IComment,
      "content" | "published" | "poster" | "post"
    >;
    const newComment: IComment = new Comment({
      content: reqBody.content,
      published: reqBody.published,
      // Change commenter id from hardcoded
      commenter: COMMENTERID,
      post: req.postId,
      _id: req.params.id,
    });

    // update previous comment with new data
    Comment.findByIdAndUpdate(
      req.params.id,
      newComment,
      (updateErr: MongoError, updatedComment: IComment) => {
        if (updateErr) {
          return next(updateErr);
        }
        // find post again so that it can populate the comments
        Post.findById(req.postId)
          .populate({
            path: "comments",
            populate: { path: "commenter", select: "username" },
          })
          .exec((postErr, post) => {
            if (postErr) {
              return next(postErr);
            }
            // if successful send updated post
            res.json({ post });
          });
      }
    );
  },
];

// delete comment
exports.delete_comment = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  Comment.findByIdAndRemove(req.params.id, (err: MongoError) => {
    if (err) {
      return next(err);
    }
    // find post again so that it can populate the comments
    Post.findById(req.postId)
      .populate({
        path: "comments",
        populate: { path: "commenter", select: "username" },
      })
      .exec((postErr, post) => {
        if (postErr) {
          return next(postErr);
        }
        // return No Content
        res.json({ response: `Comment ${req.params.id} deleted`, post });
      });
  });
};
