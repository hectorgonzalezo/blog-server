import { Document, ObjectId } from "mongoose";

export interface IComment extends Document {
  content: string;
  published: boolean;
  poster: ObjectId;
}
