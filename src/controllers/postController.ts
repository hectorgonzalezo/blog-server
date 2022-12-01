import { Response, Request, NextFunction } from "express";
import { MongoError } from 'mongodb';
const { body, validationResult } = require("express-validator");
import { IPost } from "../types/post";
import Post from "../models/postModel";
import { IComment } from "src/types/comment";
import Comment from '../models/commentModel';

const POSTERID = "6387b1034b273a93bba9303e";

// Get all posts
exports.get_all_posts = (req: Request, res: Response, next: NextFunction) => {
  Post.find()
    .sort({ createdAt: 1 })
    .populate("poster")
    .exec((err, posts: IPost[]) => {
      if (err) {
        console.log(err)
        return next(err);
      }
      res.json({ posts });
    });
};

// Create a single post
exports.create_post = [
  body("title", "A blog title is required")
    .trim()
    .isLength({ min: 1, max: 100})
    .withMessage("Blog title must be between 1 and 100 characters")
    .escape(),
  body("content", "Blog content is required")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Blog content can't be empty")
    .escape(),
  body("poster", "Blog poster is required")
    .trim()
    .escape(),
  (req: Request, res: Response, next: NextFunction) => {
    // get validation errors
    const errors = validationResult(req);
    // If there are errors, return body
    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("author_form", {
        post: req.body,
        errors: errors.array(),
      });
      return;
    }
    // If data is valid
    // Create new post
    const reqBody = req.body as Pick<IPost, "title" | "content" | "published" | "poster" | "comments">;
    const newPost: IPost = new Post({
      title: reqBody.title,
      content: reqBody.content,
      published: reqBody.published,
      // Change poster id from hardcoded
      poster: POSTERID,
      comments: reqBody.comments,
    });
    newPost.save((err) => {
      if (err) {
        return next(err);
      }
      // Successful, send post data
      res.json({ post: newPost });
    });
  }
];

// Get a single post
exports.get_post = (req: Request, res: Response, next: NextFunction) => {
  Post.findById(req.params.id)
    .populate("comments")
    .exec((err, post) => {
      if (err) {
        return next(err);
      }
      res.json({ post });
    });
};

// update existing post
exports.update_post = [
  body("title", "A blog title is required")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Blog title must be between 1 and 100 characters")
    .escape(),
  body("content", "Blog content is required")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Blog content can't be empty")
    .escape(),
  body("poster", "Blog poster is required").trim().escape(),
  (req: Request, res: Response, next: NextFunction) => {
    // get validation errors
    const errors = validationResult(req);
    // If there are errors, return body
    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("author_form", {
        post: req.body,
        errors: errors.array(),
      });
      return;
    }
    // If data is valid
    // Create new post
    const reqBody = req.body as Pick<
      IPost,
      "title" | "content" | "published" | "poster" | "comments"
    >;
    const newPost: IPost = new Post({
      title: reqBody.title,
      content: reqBody.content,
      published: reqBody.published,
      // Change poster id from hardcoded
      poster: POSTERID,
      comments: reqBody.comments,
      _id: req.params.id,
    });

    // update previous post with new data
    Post.findByIdAndUpdate(
      req.params.id,
      newPost,
      (updateErr: MongoError, updatedPost: IPost) => {
        if (updateErr) {
          return next(updateErr);
        }
        res.json({ post: newPost });
      }
    );
  },
];

exports.delete_post = [
  (req: Request, res: Response, next: NextFunction) => {
    // delete all comments in post
    Comment.find({ post: req.params.id }).exec((err, results) => {
      console.log(results)
      results.forEach((comment: IComment, i) => {
        Comment.findByIdAndRemove(comment._id, (removeErr: MongoError) => {
          if (removeErr) {
            return next(removeErr);
          }
        });
      });
      next();
    });
  },
  // delete post
  (req: Request, res: Response, next: NextFunction) => {
    Post.findByIdAndRemove(req.params.id, (err: MongoError) => {
      if (err) {
        return next(err);
      }
    });
    // return No Content
    res.json({ response: `Post ${req.params.id} deleted` });
  },
];
