"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { body, validationResult } = require("express-validator");
const postModel_1 = __importDefault(require("../models/postModel"));
const commentModel_1 = __importDefault(require("../models/commentModel"));
const POSTERID = "6387b1034b273a93bba9303e";
// Get all posts
exports.get_all_posts = (req, res, next) => {
    postModel_1.default.find()
        .sort({ createdAt: 1 })
        .populate("poster", "username")
        .populate("comments")
        .exec((err, posts) => {
        if (err) {
            return next(err);
        }
        res.json({ posts });
    });
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
        .withMessage("Blog content can't be empty")
        .escape(),
    body("poster", "Blog poster is required").trim().escape(),
    (req, res, next) => {
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
        const reqBody = req.body;
        const newPost = new postModel_1.default({
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
    },
];
// Get a single post
exports.get_post = (req, res, next) => {
    postModel_1.default.findById(req.params.id)
        .populate({
        path: "comments",
        populate: { path: "commenter", select: "username" },
    })
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
    (req, res, next) => {
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
        const reqBody = req.body;
        const newPost = new postModel_1.default({
            title: reqBody.title,
            content: reqBody.content,
            published: reqBody.published,
            // Change poster id from hardcoded
            poster: POSTERID,
            comments: reqBody.comments,
            _id: req.params.id,
        });
        // option to return updated post
        const updateOption = {
            new: true,
            upsert: true,
            rawResult: true,
        };
        // update previous post with new data
        postModel_1.default.findByIdAndUpdate(req.params.id, newPost, updateOption, (updateErr, updatedPost) => {
            if (updateErr) {
                return next(updateErr);
            }
            res.json({ post: updatedPost });
        });
    },
];
exports.delete_post = [
    (req, res, next) => {
        // delete all comments in post
        commentModel_1.default.find({ post: req.params.id }).exec((err, results) => {
            results.forEach((comment) => {
                commentModel_1.default.findByIdAndRemove(comment._id, (removeErr) => {
                    if (removeErr) {
                        return next(removeErr);
                    }
                });
            });
            next();
        });
    },
    // delete post
    (req, res, next) => {
        postModel_1.default.findByIdAndRemove(req.params.id, (err) => {
            if (err) {
                return next(err);
            }
        });
        // return No Content
        res.json({ response: `Post ${req.params.id} deleted` });
    },
];
//# sourceMappingURL=postController.js.map