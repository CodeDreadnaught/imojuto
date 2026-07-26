import { Boxes } from "lucide-react";
import { CategoryAdminClient } from "@/app/(admin)/admin/categories/category-admin-client";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { connectDb } from "@/lib/db";
import { requireCapability } from "@/lib/rbac";
import { requireSession } from "@/lib/session";
import { formatDate } from "@/lib/utils";
import { RequestCategory } from "@/models";

async function requireCategoryManagement() {
  const session = await requireSession();
  requireCapability(session, "category:manage");
}

async function getCategories() {
  await connectDb();

  const categories = await RequestCategory.find({})
    .sort({ isActive: -1, name: 1 })
    .select("name slug description isActive updatedAt")
    .lean();

  return categories.map((category) => ({
    id: String(category._id),
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
    isActive: category.isActive,
    updatedAt: formatDate(category.updatedAt ?? new Date()),
  }));
}

export default async function AdminCategoriesPage() {
  await requireCategoryManagement();

  const categories = await getCategories();

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          title="Request Categories"
          description="Create and maintain the categories students and staff use when submitting maintenance requests."
        />
        {categories.length ? (
          <CategoryAdminClient categories={categories} />
        ) : (
          <div className="grid gap-6">
            <CategoryAdminClient categories={categories} />
            <EmptyState
              icon={Boxes}
              title="No categories yet"
              description="Add the first category to make it available in the request submission form."
            />
          </div>
        )}
      </div>
    </main>
  );
}
