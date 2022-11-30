import { IUser } from '../types/user';
import { model, Schema } from "mongoose";
 
const userSchema: Schema = new Schema(
  {
    username: { type: String, required: true },
    email: {
      type: String,
      required: true,
      validate: {
        validator: (value: string) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value),
        message: (props: { value: string }) => `${props.value} is not a valid email`,
      },
    },
    password: { type: String, required: true },
    permission: {
      type: String,
      required: true,
      enum: ["regular", "admin"],
      default: "regular",
    },
  }
);

export default model<IUser>("user", userSchema);