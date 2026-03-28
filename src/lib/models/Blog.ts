import mongoose, { Schema, Document, Model } from "mongoose";
import { BlogStatus, BlogSource } from "@/enums";

export interface BlogDocument extends Document {
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  content: string;
  coverImage: string;
  status: BlogStatus;
  source: BlogSource;
  mediumUrl: string;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<BlogDocument>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    subtitle: { type: String, default: "" },
    description: { type: String, default: "" },
    content: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    status: {
      type: String,
      enum: Object.values(BlogStatus),
      default: BlogStatus.DRAFT,
    },
    source: {
      type: String,
      enum: Object.values(BlogSource),
      default: BlogSource.LOCAL,
    },
    mediumUrl: { type: String, default: "" },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Blog: Model<BlogDocument> =
  mongoose.models.Blog || mongoose.model<BlogDocument>("Blog", blogSchema);
