import mongoose, { Schema, Document, Model } from "mongoose";

export interface SiteConfigDocument extends Document {
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  faviconUrl: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  createdAt: Date;
  updatedAt: Date;
}

const siteConfigSchema = new Schema<SiteConfigDocument>(
  {
    siteName: { type: String, default: "SD" },
    siteTitle: { type: String, default: "Portfolio" },
    siteDescription: { type: String, default: "" },
    faviconUrl: { type: String, default: "" },
    ownerName: { type: String, default: "" },
    ownerEmail: { type: String, default: "" },
    ownerPhone: { type: String, default: "" },
  },
  { timestamps: true }
);

export const SiteConfig: Model<SiteConfigDocument> =
  mongoose.models.SiteConfig ||
  mongoose.model<SiteConfigDocument>("SiteConfig", siteConfigSchema);
