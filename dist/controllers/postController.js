"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { body, validationResult } = require("express-validator");
const postModel_1 = __importDefault(require("../models/postModel"));
// Get all posts
exports.get_all_posts = (req, res, next) => {
    postModel_1.default.find()
        .sort({ createdAt: 1 })
        .populate("poster")
        .exec((err, posts) => {
        if (err) {
            console.log(err);
            return next(err);
        }
        console.log(posts);
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
    body("poster", "Blog poster is required")
        .trim()
        .escape(),
    (req, res, next) => {
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
        const reqBody = req.body;
        const newPost = new postModel_1.default({
            title: reqBody.title,
            content: reqBody.content,
            published: reqBody.published,
            // Change poster id from hardcoded
            poster: "6387b1034b273a93bba9303e",
            comments: reqBody.comments,
        });
        newPost.save((err) => {
            if (err) {
                return next(err);
            }
            // Successful, send post data
            res.json({ response: "create post" + req.body.title });
        });
    }
];
// Get a single post
exports.get_post = (req, res, next) => {
    postModel_1.default.findById(req.params.id)
        .populate("comments")
        .exec((err, post) => {
        if (err) {
            return next(err);
        }
        res.json({ post });
    });
};
exports.update_post = (req, res) => {
    res.json({ response: 'update post' + req.params.id });
};
exports.delete_post = (req, res) => {
    res.json({ response: 'delete post' + req.params.id });
};
//# sourceMappingURL=postController.js.map