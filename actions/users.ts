"use server";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectDb } from "@/lib/db";
import { requireCapability } from "@/lib/rbac";
import { requireSession } from "@/lib/session";
import { Role, User } from "@/models";

type UserActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

const userSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(8).optional(),
  roleId: z.string().refine((value) => mongoose.Types.ObjectId.isValid(value)),
  department: z.string().trim().optional(),
  phone: z.string().trim().optional(),
});

async function requireUserManagement() {
  const session = await requireSession();
  requireCapability(session, "user:manage");
}

export async function listUsersAndRoles() {
  await requireUserManagement();
  await connectDb();
  const [users, roles] = await Promise.all([
    User.find({}).populate("roleId", "label name").sort({ createdAt: -1 }).lean(),
    Role.find({}).sort({ label: 1 }).lean(),
  ]);

  return {
    users: users.map((user) => ({
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: typeof user.roleId === "object" && user.roleId && "label" in user.roleId ? String(user.roleId.label) : "Unknown role",
      isActive: user.isActive,
      department: user.department ?? "",
      phone: user.phone ?? "",
    })),
    roles: roles.map((role) => ({ id: String(role._id), label: role.label, name: role.name })),
  };
}

export async function createManagedUser(_state: UserActionState, formData: FormData): Promise<UserActionState> {
  await requireUserManagement();
  const parsed = userSchema.required({ password: true }).safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    roleId: formData.get("roleId"),
    department: formData.get("department") || undefined,
    phone: formData.get("phone") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, message: "Check the highlighted fields.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await connectDb();
  if (await User.findOne({ email: parsed.data.email }).select("_id")) {
    return { ok: false, message: "Email is already registered.", fieldErrors: { email: ["Email is already registered."] } };
  }

  await User.create({
    ...parsed.data,
    passwordHash: await bcrypt.hash(parsed.data.password, 12),
    isActive: true,
  });

  revalidatePath("/admin/users");
  return { ok: true, message: "User created." };
}

export async function setUserActive(formData: FormData) {
  await requireUserManagement();
  const id = String(formData.get("id") ?? "");
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("User id is invalid.");
  await connectDb();
  await User.findByIdAndUpdate(id, { isActive: formData.get("isActive") === "true" }, { runValidators: true });
  revalidatePath("/admin/users");
  revalidatePath("/admin/requests");
}
