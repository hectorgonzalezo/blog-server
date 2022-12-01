"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    content: { type: String, required: true },
    published: { type: Boolean, required: true, default: false },
    commenter: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    post: { type: mongoose_1.Schema.Types.ObjectId, required: true },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Comment", commentSchema);
//# sourceMappingURL=commentModel.js.map