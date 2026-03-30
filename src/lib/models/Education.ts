import mongoose, { Schema, Document, Model } from "mongoose";

export interface EducationDocument extends Document {
  school: string;
  degree: string;
  location: string;
  year: string;
  logo: string;
  schoolUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const educationSchema = new Schema<EducationDocument>(
  {
    school: { type: String, required: true },
    degree: { type: String, required: true },
    location: { type: String, default: "" },
    year: { type: String, default: "" },
    logo: { type: String, default: "" },
    schoolUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Education: Model<EducationDocument> =
  mongoose.models.Education ||
  mongoose.model<EducationDocument>("Education", educationSchema);
