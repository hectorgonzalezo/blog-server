"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_all_users = (req, res) => {
    res.json({ response: 'All users' });
};
exports.get_user = (req, res) => {
    res.json({ response: 'read user' + req.params.userId });
};
exports.create_user = (req, res) => {
    res.json({ response: 'create user' + req.params.userId });
};
exports.update_user = (req, res) => {
    res.json({ response: 'update user' + req.params.userId });
};
exports.delete_user = (req, res) => {
    res.json({ response: 'delete user' + req.params.userId });
};
