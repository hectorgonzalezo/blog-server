"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    permission: {
        type: String,
        required: true,
        enum: ["regular", "admin"],
        default: "regular",
    },
});
exports.default = (0, mongoose_1.model)("User", userSchema);
//# sourceMappingURL=userModel.js.map