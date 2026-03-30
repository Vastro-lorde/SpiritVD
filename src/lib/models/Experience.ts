import mongoose, { Schema, Document, Model } from "mongoose";

export interface ExperienceDocument extends Document {
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  currentlyWorking: boolean;
  description: string;
  responsibilities: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const experienceSchema = new Schema<ExperienceDocument>(
  {
    company: { type: String, required: true },
    position: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, default: null },
    currentlyWorking: { type: Boolean, default: false },
    description: { type: String, default: "" },
    responsibilities: [{ type: String }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Experience: Model<ExperienceDocument> =
  mongoose.models.Experience ||
  mongoose.model<ExperienceDocument>("Experience", experienceSchema);
