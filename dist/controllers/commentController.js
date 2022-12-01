"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const commentModel_1 = __importDefault(require("../models/commentModel"));
const postModel_1 = __importDefault(require("../models/postModel"));
const COMMENTERID = "6387b1034b273a93bba9303e";
// Reads return the comment
// Creates, updates and deletes return the updated post
// Get all comments in a particular post
exports.get_all_comments = (req, res, next) => {
    commentModel_1.default.find({ post: req.postId })
        .sort({ createdAt: 1 })
        .populate("commenter")
        .exec((err, comments) => {
        if (err) {
            return next(err);
        }
        res.json({ comments });
    });
};
// Create a single comment
exports.create_comment = [
    (0, express_validator_1.body)("content", "Blog content is required")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Blog content can't be empty")
        .escape(),
    (0, express_validator_1.body)("poster", "Blog commenter is required")
        .trim()
        .escape(),
    (req, res, next) => {
        // get validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        // If there are errors, return body
        if (!errors.isEmpty()) {
            // There are errors, send them via json 
            res.json({ errors: errors.array() });
        }
        // If data is valid
        // Create new comment
        const reqBody = req.body;
        const newComment = new commentModel_1.default({
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
            const updateOption = {
                new: false,
                upsert: true,
                rawResult: true,
            };
            // add comment to post
            postModel_1.default.findByIdAndUpdate(req.postId, { $push: { comments: newComment } }, updateOption, (updateErr, updatedPost) => {
                if (updateErr) {
                    return next(updateErr);
                }
                // find post again so that it can populate the comments
                postModel_1.default.findById(req.postId).populate({ path: "comments", populate: { path: "commenter" } }).exec((postErr, post) => {
                    if (postErr) {
                        return next(postErr);
                    }
                    // if successful send updated post
                    res.json({ post });
                });
            });
        });
    },
];
// Get a single comment
exports.get_comment = (req, res, next) => {
    commentModel_1.default.findById(req.params.id)
        .populate("commenter")
        .exec((err, comment) => {
        if (err) {
            return next(err);
        }
        res.json({ comment });
    });
};
// update existing comment
exports.update_comment = [
    (0, express_validator_1.body)("content", "Blog content is required")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Blog content can't be empty")
        .escape(),
    (0, express_validator_1.body)("commenter", "Blog commenter is required").trim().escape(),
    (req, res, next) => {
        // get validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        // If there are errors, return body
        if (!errors.isEmpty()) {
            // There are errors, return json with errors array
            res.json({ errors: errors.array() });
            return;
        }
        // If data is valid
        // Create new comment
        const reqBody = req.body;
        const newComment = new commentModel_1.default({
            content: reqBody.content,
            published: reqBody.published,
            // Change commenter id from hardcoded
            commenter: COMMENTERID,
            post: req.postId,
            _id: req.params.id,
        });
        // update previous comment with new data
        commentModel_1.default.findByIdAndUpdate(req.params.id, newComment, (updateErr, updatedComment) => {
            console.log(updateErr);
            if (updateErr) {
                return next(updateErr);
            }
            // find post again so that it can populate the comments
            postModel_1.default.findById(req.postId).populate({ path: "comments", populate: { path: "commenter" } }).exec((postErr, post) => {
                if (postErr) {
                    return next(postErr);
                }
                // if successful send updated post
                res.json({ post });
            });
        });
    },
];
// delete comment
exports.delete_comment =
    (req, res, next) => {
        commentModel_1.default.findByIdAndRemove(req.params.id, (err) => {
            if (err) {
                return next(err);
            }
            // find post again so that it can populate the comments
            postModel_1.default.findById(req.postId)
                .populate({ path: "comments", populate: { path: "commenter" } })
                .exec((postErr, post) => {
                if (postErr) {
                    return next(postErr);
                }
                // return No Content
                res.json({ response: `Comment ${req.params.id} deleted`, post });
            });
        });
    };
//# sourceMappingURL=commentController.js.map