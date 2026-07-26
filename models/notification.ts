import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

export const notificationTypes = ["assigned", "status_changed", "resolved"] as const;

const notificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: notificationTypes, required: true },
    message: { type: String, required: true, trim: true },
    serviceRequestId: { type: Schema.Types.ObjectId, ref: "ServiceRequest", required: true },
    isRead: { type: Boolean, required: true, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

export type NotificationDocument = InferSchemaType<typeof notificationSchema>;

export const Notification =
  (mongoose.models.Notification as Model<NotificationDocument>) ||
  mongoose.model<NotificationDocument>("Notification", notificationSchema);
