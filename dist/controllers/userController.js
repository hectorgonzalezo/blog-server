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
const passport_1 = __importDefault(require("passport"));
const express_validator_1 = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel_1 = __importDefault(require("../models/userModel"));
const EXPIRATION = "24h";
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
            return res.json({ errors: errors.array() });
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
                    return res.send(loginErr);
                }
                // generate a signed son web token with the contents of user object and return it in the response
                // user must be converted to JSON
                const token = jwt.sign(user.toJSON(), process.env.AUTH_SECRET);
                return res.json({ user, token });
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
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        // if validation didn't succeed
        if (!errors.isEmpty()) {
            // Return errors
            res.status(400).send({ errors: errors.array() });
            return;
        }
        // If its valid
        // encrypt password
        try {
            const hashedPassword = yield bcrypt.hash(req.body.password, 10);
            // look if username already exists
            const existingUser = yield userModel_1.default.find({ username: req.body.username });
            if (existingUser.length !== 0) {
                // return error and user data filled so far
                return res.status(400).send({
                    errors: [{ msg: "Username already exists", user: req.body }],
                });
            }
            // Create new user
            const newUser = new userModel_1.default({
                username: req.body.username,
                password: hashedPassword,
                permission: "regular",
            });
            const user = yield newUser.save();
            // generate a signed son web token with the contents of user object and return it in the response
            // user must be converted to JSON
            const token = jwt.sign(newUser.toJSON(), process.env.AUTH_SECRET);
            return res.json({ user: newUser, token });
        }
        catch (err) {
            return next(err);
        }
    }),
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
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        // if validation didn't succeed
        if (!errors.isEmpty()) {
            // Return errors
            res.json({ errors: errors.array() });
            return;
        }
        // If its valid
        // encrypt password
        try {
            const hashedPassword = yield bcrypt.hash(req.body.password, 10);
            // Create new user
            const newUser = new userModel_1.default({
                username: req.body.username,
                password: hashedPassword,
                permission: req.body.permission,
            });
            // option to return updated post
            const updateOption = {
                new: true,
                upsert: true,
                rawResult: true,
            };
            const user = yield userModel_1.default.findByIdAndUpdate(req.params.id, newUser, updateOption);
            // generate a signed son web token with the contents of user object and return it in the response
            // user must be converted to JSON
            const token = jwt.sign(newUser.toJSON(), process.env.AUTH_SECRET);
            return res.json({ user: newUser, token });
        }
        catch (err) {
            return next(err);
        }
    }),
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