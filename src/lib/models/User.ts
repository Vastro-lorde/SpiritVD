import mongoose, { Schema, Document, Model } from "mongoose";
import { UserRole } from "@/enums";

export interface UserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  bio: string;
  title: string;
  profileImage: string;
  resumeUrl: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    bio: { type: String, default: "" },
    title: { type: String, default: "" },
    profileImage: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.ADMIN,
    },
  },
  { timestamps: true }
);

export const User: Model<UserDocument> =
  mongoose.models.User || mongoose.model<UserDocument>("User", userSchema);
