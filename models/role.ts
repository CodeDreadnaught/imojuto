import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

export const roleNames = ["student_staff", "maintenance_officer", "admin"] as const;

export type RoleName = (typeof roleNames)[number];

const roleSchema = new Schema(
  {
    name: { type: String, enum: roleNames, required: true, unique: true },
    label: { type: String, required: true, trim: true },
    permissions: { type: [String], required: true, default: [] },
  },
  { timestamps: true },
);

export type RoleDocument = InferSchemaType<typeof roleSchema>;

export const Role =
  (mongoose.models.Role as Model<RoleDocument>) || mongoose.model<RoleDocument>("Role", roleSchema);
