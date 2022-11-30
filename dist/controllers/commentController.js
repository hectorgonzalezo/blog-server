"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_all_comments = (req, res) => {
    res.json({ response: `All comments in post ${req.messageId}` });
};
exports.get_comment = (req, res) => {
    res.json({ response: 'read comment' + req.params.commentId });
};
exports.create_comment = (req, res) => {
    res.json({ response: 'create comment' + req.params.commentId });
};
exports.update_comment = (req, res) => {
    res.json({ response: 'update comment' + req.params.commentId });
};
exports.delete_comment = (req, res) => {
    res.json({ response: 'delete comment' + req.params.commentId });
};
