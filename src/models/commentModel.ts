import { IComment } from '../types/comment';
import { model, Schema } from "mongoose";
 
const commentSchema: Schema = new Schema(
  {
    content: { type: String, required: true },
    published: { type: Boolean, required: true, default: false },
    commenter: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true },
);

export default model<IComment>("Comment", commentSchema);