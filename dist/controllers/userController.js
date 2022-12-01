"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const express_validator_1 = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel_1 = __importDefault(require("../models/userModel"));
// Get info about a particular user
exports.get_user = (req, res, next) => {
    userModel_1.default.findById(req.params.id, { username: 1 }).exec((err, user) => {
        if (err) {
            return next(err);
        }
        res.json({ user });
    });
};
// Log in
exports.login_user = (req, res, next) => {
    passport_1.default.authenticate("local", { session: false }, (err, user, info) => {
        if (err || !user) {
            console.log({ err, user });
            return res.status(400).json({
                message: "Something is not right",
                user: user,
            });
        }
        req.login(user, { session: false }, (loginErr) => {
            if (loginErr) {
                res.send(loginErr);
            }
            // generate a signed son web token with the contents of user object and return it in the response
            // user must be converted to JSON
            jwt.sign(user.toJSON(), process.env.AUTH_SECRET, {}, (signErr, token) => {
                if (signErr) {
                    return next(signErr);
                }
                return res.json({ user, token });
            });
        });
    })(req, res);
};
// log out
exports.logout_user = (req, res) => {
    res.json({ response: 'logout user' });
};
// Sign user up
exports.create_user = [
    (0, express_validator_1.body)("username")
        .trim()
        .isLength({ min: 3, max: 25 })
        .escape()
        .withMessage("User name must be between 3 and 25 characters long"),
    (0, express_validator_1.body)("password")
        .trim()
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    (0, express_validator_1.body)("passwordConfirm")
        .trim()
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
        .custom((value, { req }) => value === req.body.password)
        .withMessage("Passwords don't match!"),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        // if validation didn't succeed
        if (!errors.isEmpty()) {
            // Return errors
            res.json({ errors: errors.array() });
            return;
        }
        // If its valid
        // encrypt password
        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
            if (err) {
                return next(err);
            }
            // look if username already exists
            userModel_1.default.find({ username: req.body.username }).exec((userErr, user) => {
                if (user.length !== 0) {
                    // return error and user data filled so far
                    res.json({ error: "Username already exists", user: req.body });
                }
                else {
                    // Create new user
                    const newUser = new userModel_1.default({
                        username: req.body.username,
                        password: hashedPassword,
                        membershipStatus: "regular",
                    });
                    newUser.save((userSaveErr) => {
                        if (userSaveErr) {
                            return next(userSaveErr);
                        }
                        res.json({ user: newUser });
                    });
                }
            });
        });
    },
];
exports.update_user = (req, res) => {
    res.json({ response: 'update user' + req.params.userId });
};
exports.delete_user = (req, res) => {
    res.json({ response: 'delete user' + req.params.userId });
};
//# sourceMappingURL=userController.js.map