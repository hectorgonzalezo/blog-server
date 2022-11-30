import { Document, ObjectId } from "mongoose";

export interface IPost extends Document {
  title: string;
  content: string;
  published: boolean;
  poster: ObjectId
}