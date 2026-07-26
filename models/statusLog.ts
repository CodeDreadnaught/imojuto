import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { requestStatuses } from "@/models/serviceRequest";

const statusLogSchema = new Schema(
  {
    serviceRequestId: { type: Schema.Types.ObjectId, ref: "ServiceRequest", required: true },
    actorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fromStatus: { type: String, enum: requestStatuses },
    toStatus: { type: String, enum: requestStatuses, required: true },
    note: { type: String, trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

statusLogSchema.index({ serviceRequestId: 1, createdAt: 1 });
statusLogSchema.index({ actorId: 1, createdAt: -1 });

export type StatusLogDocument = InferSchemaType<typeof statusLogSchema>;

export const StatusLog =
  (mongoose.models.StatusLog as Model<StatusLogDocument>) ||
  mongoose.model<StatusLogDocument>("StatusLog", statusLogSchema);
