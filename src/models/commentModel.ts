import { IComment } from '../types/comment';
import { model, Schema } from "mongoose";
require('./userModel');
require('./postModel');
 
const commentSchema: Schema = new Schema(
  {
    content: { type: String, required: true },
    published: { type: Boolean, required: true, default: false },
    commenter: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    post: { type: Schema.Types.ObjectId, required: true, ref: "Post" },
  },
  { timestamps: true },
);

export default model<IComment>("Comment", commentSchema);