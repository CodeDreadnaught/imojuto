import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const requestCategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true },
    isActive: { type: Boolean, required: true, default: true },
  },
  { timestamps: true },
);

export type RequestCategoryDocument = InferSchemaType<typeof requestCategorySchema>;

export const RequestCategory =
  (mongoose.models.RequestCategory as Model<RequestCategoryDocument>) ||
  mongoose.model<RequestCategoryDocument>("RequestCategory", requestCategorySchema);
