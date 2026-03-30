import mongoose, { Schema, Document, Model } from "mongoose";
import { ProjectStatus } from "@/enums";

export interface ProjectDocument extends Document {
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  galleryImages: string[];
  techStack: string[];
  services: string[];
  category: string;
  year: string;
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  status: ProjectStatus;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<ProjectDocument>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    coverImage: { type: String, default: "" },
    galleryImages: [{ type: String }],
    techStack: [{ type: String }],
    services: [{ type: String }],
    category: { type: String, default: "" },
    year: { type: String, default: "" },
    liveUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: Object.values(ProjectStatus),
      default: ProjectStatus.DRAFT,
    },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Project: Model<ProjectDocument> =
  mongoose.models.Project ||
  mongoose.model<ProjectDocument>("Project", projectSchema);
