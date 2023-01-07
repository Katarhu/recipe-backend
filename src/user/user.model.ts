import mongoose from "mongoose";

type UserRole = "admin" | "user";

export interface IUser {
  email: string;
  username: string;
  password: string;
  role: UserRole;
}

export const UserSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true},
  password: { type: String, required: true},
  email: { type: String, required: true },
  role: { type: String, required: true, default: "user" }
})


