"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_all_posts = (req, res) => {
    res.json({ response: "get all posts" });
};
exports.get_post = (req, res) => {
    res.json({ response: 'read post' + req.params.id });
};
exports.create_post = (req, res) => {
    res.json({ response: 'create post' + req.params.id });
};
exports.update_post = (req, res) => {
    res.json({ response: 'update post' + req.params.id });
};
exports.delete_post = (req, res) => {
    res.json({ response: 'delete post' + req.params.id });
};
