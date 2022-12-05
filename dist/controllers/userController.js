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
exports.login_user = [
    (0, express_validator_1.body)("username")
        .trim()
        .isLength({ min: 3, max: 25 })
        .escape()
        .withMessage("User name must be between 3 and 25 characters long"),
    (0, express_validator_1.body)("password")
        .trim()
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        // if validation didn't succeed
        if (!errors.isEmpty()) {
            // Return errors
            res.json({ errors: errors.array() });
            return;
        }
        passport_1.default.authenticate("local", { session: false }, (err, user) => {
            if (err || !user) {
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
                jwt.sign(user.toJSON(), process.env.AUTH_SECRET, { expiresIn: "24h" }, (signErr, token) => {
                    if (signErr) {
                        return next(signErr);
                    }
                    return res.json({ user, token });
                });
            });
        })(req, res);
    }
];
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
                        permission: "regular",
                    });
                    newUser.save((userSaveErr) => {
                        if (userSaveErr) {
                            return next(userSaveErr);
                        }
                        // generate a signed son web token with the contents of user object and return it in the response
                        // user must be converted to JSON
                        jwt.sign(newUser.toJSON(), process.env.AUTH_SECRET, { expiresIn: "24h" }, (signErr, token) => {
                            if (signErr) {
                                return next(signErr);
                            }
                            return res.json({ user: newUser, token });
                        });
                    });
                }
            });
        });
    },
];
// Update a single user
exports.update_user = [
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
    (0, express_validator_1.body)("permission", "User permission is required")
        .trim()
        .isIn(["regular", "admin"])
        .withMessage("User permission can only be regular or admin"),
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
            // Create new user
            const newUser = new userModel_1.default({
                username: req.body.username,
                password: hashedPassword,
                permission: req.body.permission,
                _id: req.params.id,
            });
            // option to return updated post
            const updateOption = {
                new: true,
                upsert: true,
                rawResult: true,
            };
            // update user in database
            userModel_1.default.findByIdAndUpdate(req.params.id, newUser, updateOption, (updateErr, updatedUser) => {
                if (updateErr) {
                    return next(updateErr);
                }
                // generate a signed son web token with the contents of user object and return it in the response
                // user must be converted to JSON
                jwt.sign(newUser.toJSON(), process.env.AUTH_SECRET, { expiresIn: "24h" }, (signErr, token) => {
                    if (signErr) {
                        return next(signErr);
                    }
                    return res.json({ user: updatedUser.value, token });
                });
            });
        });
    },
];
// Delete a single user
exports.delete_user = (req, res, next) => {
    userModel_1.default.findByIdAndDelete(req.params.id, (err) => {
        if (err) {
            return next(err);
        }
        res.json({ response: `deleted user ${req.params.id}` });
    });
};
//# sourceMappingURL=userController.js.map