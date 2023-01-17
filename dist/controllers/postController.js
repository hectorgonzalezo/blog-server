"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { body, validationResult } = require("express-validator");
const postModel_1 = __importDefault(require("../models/postModel"));
const commentModel_1 = __importDefault(require("../models/commentModel"));
// Get all posts
exports.get_all_posts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield postModel_1.default.find()
            .sort({ createdAt: 1 })
            .populate("poster", "username");
        return res.json({ posts });
    }
    catch (err) {
        return next(err);
    }
});
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
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // get validation errors
        const errors = validationResult(req);
        // If there are errors, return body
        if (!errors.isEmpty()) {
            // There are errors, send them via json
            return res.json({ errors: errors.array() });
        }
        // If data is valid
        // Create new post
        const reqBody = req.body;
        const newPost = new postModel_1.default({
            title: reqBody.title,
            content: reqBody.content,
            published: reqBody.published,
            // Change poster id from hardcoded
            poster: reqBody.poster,
            comments: reqBody.comments,
        });
        try {
            const post = yield newPost.save();
            // Successful, send post data
            return res.json({ post: newPost });
        }
        catch (error) {
            return next(error);
        }
    }),
];
// Get a single post
exports.get_post = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield postModel_1.default.findById(req.params.id)
            .populate("poster", "username")
            .populate({
            path: "comments",
            populate: { path: "commenter", select: "username" },
        });
        return res.json({ post });
    }
    catch (err) {
        return next(err);
    }
});
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
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
            poster: reqBody.poster,
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
        try {
            const post = yield postModel_1.default.findByIdAndUpdate(req.params.id, newPost, updateOption);
            return res.json({ post: post.value });
        }
        catch (err) {
            return next(err);
        }
    }),
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