import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const assignmentSchema = new Schema(
  {
    serviceRequestId: { type: Schema.Types.ObjectId, ref: "ServiceRequest", required: true },
    officerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    assignedById: { type: Schema.Types.ObjectId, ref: "User", required: true },
    assignedAt: { type: Date, required: true, default: Date.now },
    unassignedAt: { type: Date },
    isActive: { type: Boolean, required: true, default: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true },
);

assignmentSchema.index({ serviceRequestId: 1, isActive: 1 });
assignmentSchema.index({ officerId: 1, isActive: 1 });

export type AssignmentDocument = InferSchemaType<typeof assignmentSchema>;

export const Assignment =
  (mongoose.models.Assignment as Model<AssignmentDocument>) ||
  mongoose.model<AssignmentDocument>("Assignment", assignmentSchema);
