"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    published: { type: Boolean, required: true, default: false },
    poster: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    comments: { type: [mongoose_1.Schema.Types.ObjectId], required: true },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Post", postSchema);
//# sourceMappingURL=postModel.js.map