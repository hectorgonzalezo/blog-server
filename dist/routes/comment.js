"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport = require("passport");
const commentModel_1 = __importDefault(require("../models/commentModel"));
const commentController = require("../controllers/commentController");
const router = express_1.default.Router();
// Get all comments in a particular post
router.get("/", commentController.get_all_comments);
//Individual comment CRUD operations
// Read
router.get("/:id", commentController.get_comment);
// create
// only if user is logged in
router.post("/", passport.authenticate("jwt", { session: false }), commentController.create_comment);
// update
// only if logged in user is the commenter
router.put("/:id", (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user) => {
        if (err) {
            return next(err);
        }
        commentModel_1.default.findById(req.params.id).exec((findErr, comment) => {
            if (findErr) {
                return next(findErr);
            }
            // Only update if user is administrator or the commenter
            if (user.permission === "admin" ||
                (comment && comment.commenter.toString() === user._id.toString())) {
                next();
            }
            else {
                // if user is not admin, return error
                res.status(403).send({
                    error: "Only administrators or the user itself can update a comment",
                });
            }
        });
    })(req, res, next);
}, commentController.update_comment);
// delete
// only if logged in user is the commenter
router.delete("/:id", (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user) => {
        if (err) {
            return next(err);
        }
        commentModel_1.default.findById(req.params.id).exec((findErr, comment) => {
            if (findErr) {
                return next(findErr);
            }
            // Only delete if user is administrator or the commenter
            if (user.permission === "admin" ||
                (comment && comment.commenter.toString() === user._id.toString())) {
                next();
            }
            else {
                // if user is not admin, return error
                res.status(403).send({
                    error: "Only administrators or the user itself can delete a comment",
                });
            }
        });
    })(req, res, next);
}, commentController.delete_comment);
module.exports = router;
//# sourceMappingURL=comment.js.map