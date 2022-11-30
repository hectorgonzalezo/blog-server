import { IPost } from '../types/post';
import { model, Schema } from "mongoose";
require('./userModel');
require('./commentModel');
 
const postSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    published: { type: Boolean, required: true, default: false },
    poster: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    comments: { type: [Schema.Types.ObjectId], required: true, default: [], ref: "Comment" },
  },
  { timestamps: true },
);

export default model<IPost>("Post", postSchema);