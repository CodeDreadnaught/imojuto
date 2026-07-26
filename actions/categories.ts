"use server";

import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectDb } from "@/lib/db";
import { requireCapability } from "@/lib/rbac";
import { requireSession } from "@/lib/session";
import { slugify } from "@/lib/utils";
import { RequestCategory } from "@/models";

type CategoryActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: {
    name?: string[];
    description?: string[];
    id?: string[];
  };
};

const categoryInputSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters.").max(80, "Name must be 80 characters or fewer."),
  description: z.string().trim().max(240, "Description must be 240 characters or fewer.").optional(),
});

const idSchema = z.string().refine((value) => mongoose.Types.ObjectId.isValid(value), "Category id is invalid.");

async function requireCategoryManagement() {
  const session = await requireSession();
  requireCapability(session, "category:manage");
}

function parseCategoryForm(formData: FormData) {
  return categoryInputSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
  });
}

async function ensureSlugAvailable(slug: string, currentId?: string) {
  const duplicate = await RequestCategory.findOne({
    slug,
    ...(currentId ? { _id: { $ne: currentId } } : {}),
  }).select("_id");

  return !duplicate;
}

function validationState(error: z.ZodError): CategoryActionState {
  return {
    ok: false,
    message: "Check the highlighted fields and try again.",
    fieldErrors: error.flatten().fieldErrors,
  };
}

export async function createCategory(
  _previousState: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  await requireCategoryManagement();

  const parsed = parseCategoryForm(formData);
  if (!parsed.success) {
    return validationState(parsed.error);
  }

  const slug = slugify(parsed.data.name);
  if (!slug) {
    return {
      ok: false,
      message: "Use at least one letter or number in the category name.",
      fieldErrors: { name: ["Use at least one letter or number."] },
    };
  }

  await connectDb();

  if (!(await ensureSlugAvailable(slug))) {
    return {
      ok: false,
      message: "A category with this name already exists.",
      fieldErrors: { name: ["Category names must be unique."] },
    };
  }

  await RequestCategory.create({
    name: parsed.data.name,
    slug,
    description: parsed.data.description,
    isActive: true,
  });

  revalidatePath("/admin/categories");
  revalidatePath("/requests/new");

  return { ok: true, message: "Category added." };
}

export async function updateCategory(
  _previousState: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  await requireCategoryManagement();

  const id = String(formData.get("id") ?? "");
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    return {
      ok: false,
      message: "Category id is invalid.",
      fieldErrors: { id: ["Category id is invalid."] },
    };
  }

  const parsed = parseCategoryForm(formData);
  if (!parsed.success) {
    return validationState(parsed.error);
  }

  const slug = slugify(parsed.data.name);
  if (!slug) {
    return {
      ok: false,
      message: "Use at least one letter or number in the category name.",
      fieldErrors: { name: ["Use at least one letter or number."] },
    };
  }

  await connectDb();

  if (!(await ensureSlugAvailable(slug, parsedId.data))) {
    return {
      ok: false,
      message: "A category with this name already exists.",
      fieldErrors: { name: ["Category names must be unique."] },
    };
  }

  const category = await RequestCategory.findByIdAndUpdate(
    parsedId.data,
    {
      name: parsed.data.name,
      slug,
      description: parsed.data.description,
    },
    { new: true, runValidators: true },
  );

  if (!category) {
    return { ok: false, message: "Category was not found." };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/requests/new");

  return { ok: true, message: "Category updated." };
}

export async function setCategoryActive(formData: FormData): Promise<void> {
  await requireCategoryManagement();

  const id = String(formData.get("id") ?? "");
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    throw new Error("Category id is invalid.");
  }

  await connectDb();

  const isActive = formData.get("isActive") === "true";
  await RequestCategory.findByIdAndUpdate(parsedId.data, { isActive }, { runValidators: true });

  revalidatePath("/admin/categories");
  revalidatePath("/requests/new");
}
