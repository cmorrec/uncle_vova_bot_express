import { Schema, model } from "mongoose";
import { IUser } from "./interfaces";

const UserSchema = new Schema<IUser>(
  {
    userId: { type: String, required: true },
    username: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    description: { type: String },
    isBot: { type: Boolean, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const UserModel = model<IUser>("User", UserSchema);

export default UserModel;
