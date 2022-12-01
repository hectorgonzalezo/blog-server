"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../models/userModel"));
exports.get_all_users = (req, res) => {
    userModel_1.default.find().
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
//# sourceMappingURL=userController.js.map