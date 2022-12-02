"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport = require("passport");
const postController = require("../controllers/postController");
const router = express_1.default.Router();
// Get all posts
router.get("/", postController.get_all_posts);
//Individual post CRUD operations
// Read
router.get("/:id", postController.get_post);
// create
router.post("/", (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user) => {
        if (err) {
            return next(err);
        }
        // Only create post if user is administrator
        if (user.permission === "admin") {
            next();
        }
        else {
            // if user is not admin, return error
            res.status(403).send({
                error: "Only administrators can create a post",
            });
        }
    })(req, res, next);
}, postController.create_post);
// update
router.put("/:id", (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user) => {
        if (err) {
            return next(err);
        }
        // Only update post if user is administrator
        if (user.permission === "admin") {
            next();
        }
        else {
            // if user is not admin, return error
            res.status(403).send({
                error: "Only administrators can update a post",
            });
        }
    })(req, res, next);
}, postController.update_post);
// delete
router.delete("/:id", (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user) => {
        if (err) {
            return next(err);
        }
        // Only delete post if user is administrator
        if (user.permission === "admin") {
            next();
        }
        else {
            // if user is not admin, return error
            res.status(403).send({
                error: "Only administrators can delete a post",
            });
        }
    })(req, res, next);
}, postController.delete_post);
module.exports = router;
//# sourceMappingURL=post.js.map