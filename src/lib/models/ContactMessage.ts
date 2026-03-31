import mongoose, { Schema, Document, Model } from "mongoose";

export interface ContactMessageDocument extends Document {
  name: string;
  email: string;
  message: string;
  read: boolean;
  repliedAt: Date | null;
  createdAt: Date;
}

const contactMessageSchema = new Schema<ContactMessageDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    repliedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const ContactMessage: Model<ContactMessageDocument> =
  mongoose.models.ContactMessage ||
  mongoose.model<ContactMessageDocument>(
    "ContactMessage",
    contactMessageSchema
  );
