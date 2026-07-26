import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

export const requestPriorities = ["low", "medium", "high", "urgent"] as const;
export const requestStatuses = ["submitted", "assigned", "in_progress", "resolved", "closed", "reopened"] as const;

const attachmentSchema = new Schema(
  {
    url: { type: String, required: true },
    uploadedAt: { type: Date, required: true, default: Date.now },
  },
  { _id: false },
);

const locationSchema = new Schema(
  {
    building: { type: String, required: true, trim: true },
    roomOrArea: { type: String, required: true, trim: true },
    notes: { type: String, trim: true },
  },
  { _id: false },
);

const serviceRequestSchema = new Schema(
  {
    referenceCode: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "RequestCategory", required: true },
    requesterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    location: { type: locationSchema, required: true },
    priority: { type: String, enum: requestPriorities, required: true, default: "medium" },
    status: { type: String, enum: requestStatuses, required: true, default: "submitted" },
    attachments: { type: [attachmentSchema], required: true, default: [] },
  },
  { timestamps: true },
);

serviceRequestSchema.index({ status: 1, priority: 1, createdAt: -1 });
serviceRequestSchema.index({ requesterId: 1, createdAt: -1 });

export type ServiceRequestDocument = InferSchemaType<typeof serviceRequestSchema>;

export const ServiceRequest =
  (mongoose.models.ServiceRequest as Model<ServiceRequestDocument>) ||
  mongoose.model<ServiceRequestDocument>("ServiceRequest", serviceRequestSchema);
