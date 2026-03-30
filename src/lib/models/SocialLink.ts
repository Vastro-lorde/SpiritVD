import mongoose, { Schema, Document, Model } from "mongoose";
import { SocialPlatform } from "@/enums";

export interface SocialLinkDocument extends Document {
  platform: SocialPlatform;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

const socialLinkSchema = new Schema<SocialLinkDocument>(
  {
    platform: {
      type: String,
      enum: Object.values(SocialPlatform),
      required: true,
      unique: true,
    },
    url: { type: String, required: true },
  },
  { timestamps: true }
);

export const SocialLink: Model<SocialLinkDocument> =
  mongoose.models.SocialLink ||
  mongoose.model<SocialLinkDocument>("SocialLink", socialLinkSchema);
