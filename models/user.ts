import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    roleId: { type: Schema.Types.ObjectId, ref: "Role", required: true },
    department: { type: String, trim: true },
    phone: { type: String, trim: true },
    isActive: { type: Boolean, required: true, default: true },
  },
  { timestamps: true },
);

export type UserDocument = InferSchemaType<typeof userSchema>;

export const User =
  (mongoose.models.User as Model<UserDocument>) || mongoose.model<UserDocument>("User", userSchema);
