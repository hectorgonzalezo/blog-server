"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const userController = require("../controllers/userController");
require("../passport");
const router = express_1.default.Router();
// Log in
router.post("/log-in", userController.login_user);
//Individual user CRUD operations
// Read
// Only get users if you're authorized
router.get("/:id", (req, res, next) => {
    passport_1.default.authenticate("jwt", { session: false }, (err, user) => {
        if (err) {
            return next(err);
        }
        // Only show users if user is administrator
        if (user.permission === "admin") {
            next();
        }
        else {
            // if user is not admin, return error
            res.status(403).send({
                error: "Only administrators can get info about users",
            });
        }
    })(req, res, next);
}, userController.get_user);
// create, sign up
router.post("/sign-up", userController.create_user);
// update
router.put("/:id", (req, res, next) => {
    passport_1.default.authenticate("jwt", { session: false }, (err, user) => {
        if (err) {
            return next(err);
        }
        // Only update if user is administrator or the owner
        if (user.permission === "admin" ||
            user._id.toString() === req.params.id) {
            next();
        }
        else {
            // if user is not admin, return error
            res.status(403).send({
                error: "Only administrators or the user itself can update a user",
            });
        }
    })(req, res, next);
}, userController.update_user);
// delete
// Only delete users if you're authorized
router.delete("/:id", (req, res, next) => {
    passport_1.default.authenticate("jwt", { session: false }, (err, user) => {
        if (err) {
            return next(err);
        }
        // Only delete users if user is administrator
        if (user.permission === "admin") {
            next();
        }
        else {
            // if user is not admin, return error
            res.status(403).send({
                error: "Only administrators can delete users",
            });
        }
    })(req, res, next);
}, userController.delete_user);
module.exports = router;
//# sourceMappingURL=user.js.map