import { Response, Request, NextFunction } from "express";
import { MongoError } from "mongodb";
import { QueryOptions } from "mongoose";
const { body, validationResult } = require("express-validator");
import { IPost } from "../types/post";
import Post from "../models/postModel";
import { IComment } from "src/types/comment";
import Comment from "../models/commentModel";
import { nextTick } from "process";


// Get all posts
exports.get_all_posts = async (req: Request, res: Response, next: NextFunction) => {
  try{
  const posts = await Post.find()
    .sort({ createdAt: 1 })
    .populate("poster", "username");
    
    return res.json({ posts });
    } catch(err){
      return next(err);
    }
};

// Create a single post
exports.create_post = [
  body("title", "A blog title is required")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Blog title must be between 1 and 100 characters")
    .escape(),
  body("content", "Blog content is required")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Blog content can't be empty"),
  body("poster", "Blog poster is required").trim().escape(),
  async (req: Request, res: Response, next: NextFunction) => {
    // get validation errors
    const errors = validationResult(req);
    // If there are errors, return body
    if (!errors.isEmpty()) {
      // There are errors, send them via json
      return res.json({ errors: errors.array() });
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
      poster: reqBody.poster,
      comments: reqBody.comments,
    });
    try {
      const post = await newPost.save();
      // Successful, send post data
      return res.json({ post: newPost });
    } catch (error) {
     return next(error);
    }
  },
];

// Get a single post
exports.get_post = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("poster", "username")
      .populate({
        path: "comments",
        populate: { path: "commenter", select: "username" },
      });
    return res.json({ post });
  } catch (err) {
    return next(err);
  }
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
    .withMessage("Blog content can't be empty"),
  body("poster", "Blog poster is required").trim().escape(),
  async (req: Request, res: Response, next: NextFunction) => {
    // get validation errors
    const errors = validationResult(req);
    // If there are errors, return body
    if (!errors.isEmpty()) {
      // There are errors, send them via json
      res.json({ errors: errors.array() });
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
      poster: reqBody.poster,
      comments: reqBody.comments,
      _id: req.params.id,
    });
    // option to return updated post
    const updateOption: QueryOptions & { rawResult: true } = {
      new: true,
      upsert: true,
      rawResult: true,
    };
    // update previous post with new data
    try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      newPost,
      updateOption);
      return res.json({ post: post.value });
    } catch (err) {
      return next(err);
    }
  },
];

exports.delete_post = [
  (req: Request, res: Response, next: NextFunction) => {
    // delete all comments in post
    Comment.find({ post: req.params.id }).exec((err, results) => {
      results.forEach((comment: IComment) => {
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
