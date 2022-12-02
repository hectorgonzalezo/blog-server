import { IUser } from "../types/user";
import { model, Schema } from "mongoose";

const userSchema: Schema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  permission: {
    type: String,
    required: true,
    enum: ["regular", "admin"],
    default: "regular",
  },
});

export default model<IUser>("User", userSchema);
