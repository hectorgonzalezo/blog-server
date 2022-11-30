import { IPost } from '../types/post';
import { model, Schema } from "mongoose";
 
const postSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    published: { type: Boolean, required: true, default: false },
    poster: { type: Schema.Types.ObjectId, required: true },
    comments: { type: [Schema.Types.ObjectId], required: true },
  },
  { timestamps: true },
);

export default model<IPost>("Post", postSchema);