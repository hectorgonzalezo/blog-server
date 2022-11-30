"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    email: {
        type: String,
        required: true,
        validate: {
            validator: (value) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value),
            message: (props) => `${props.value} is not a valid email`,
        },
    },
    password: { type: String, required: true },
    permission: {
        type: String,
        required: true,
        enum: ["regular", "admin"],
        default: "regular",
    },
});
exports.default = (0, mongoose_1.model)("User", userSchema);
