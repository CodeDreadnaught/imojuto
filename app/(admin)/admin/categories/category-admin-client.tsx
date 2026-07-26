"use client";

import { useActionState } from "react";
import { CheckCircle2, Pencil, Plus, Power, PowerOff, Save } from "lucide-react";
import { createCategory, setCategoryActive, updateCategory } from "@/actions/categories";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  updatedAt: string;
};

type CategoryAdminClientProps = {
  categories: Category[];
};

type CategoryActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: {
    name?: string[];
    description?: string[];
    id?: string[];
  };
};

const initialState: CategoryActionState = {
  ok: false,
  message: "",
};

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) {
    return null;
  }

  return <p className="mt-2 text-xs font-medium text-red-700">{messages[0]}</p>;
}

function CreateCategoryForm() {
  const [state, formAction, pending] = useActionState(createCategory, initialState);

  return (
    <form action={formAction} className="grid gap-4 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="grid gap-2">
        <label htmlFor="new-category-name" className="text-sm font-medium text-stone-800">
          Name
        </label>
        <Input id="new-category-name" name="name" placeholder="Generator Repairs" required />
        <FieldError messages={state.fieldErrors?.name} />
      </div>
      <div className="grid gap-2">
        <label htmlFor="new-category-description" className="text-sm font-medium text-stone-800">
          Description
        </label>
        <Textarea
          id="new-category-description"
          name="description"
          placeholder="Optional notes for admins and request forms"
        />
        <FieldError messages={state.fieldErrors?.description} />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className={state.ok ? "text-sm font-medium text-emerald-800" : "text-sm font-medium text-stone-600"}>
          {state.message || "New categories are active immediately."}
        </p>
        <Button type="submit" disabled={pending}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          {pending ? "Adding" : "Add category"}
        </Button>
      </div>
    </form>
  );
}

function CategoryRow({ category }: { category: Category }) {
  const [state, formAction, pending] = useActionState(updateCategory, initialState);

  return (
    <tr className="border-b border-stone-200 align-top last:border-0">
      <td className="px-4 py-4">
        <form action={formAction} className="grid min-w-64 gap-3">
          <input type="hidden" name="id" value={category.id} />
          <div>
            <label htmlFor={`name-${category.id}`} className="sr-only">
              Category name
            </label>
            <Input id={`name-${category.id}`} name="name" defaultValue={category.name} required />
            <FieldError messages={state.fieldErrors?.name} />
          </div>
          <div>
            <label htmlFor={`description-${category.id}`} className="sr-only">
              Category description
            </label>
            <Textarea
              id={`description-${category.id}`}
              name="description"
              defaultValue={category.description}
              className="min-h-20"
            />
            <FieldError messages={state.fieldErrors?.description} />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button type="submit" size="sm" variant="outline" disabled={pending}>
              {pending ? (
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Save className="h-4 w-4" aria-hidden="true" />
              )}
              {pending ? "Saving" : "Save"}
            </Button>
            {state.message ? (
              <span className={state.ok ? "text-xs font-medium text-emerald-800" : "text-xs font-medium text-red-700"}>
                {state.message}
              </span>
            ) : null}
          </div>
        </form>
      </td>
      <td className="px-4 py-4 text-sm text-stone-600">{category.slug}</td>
      <td className="px-4 py-4">
        <Badge variant={category.isActive ? "success" : "secondary"}>
          {category.isActive ? "Active" : "Inactive"}
        </Badge>
      </td>
      <td className="px-4 py-4 text-sm text-stone-600">{category.updatedAt}</td>
      <td className="px-4 py-4 text-right">
        <form action={setCategoryActive}>
          <input type="hidden" name="id" value={category.id} />
          <input type="hidden" name="isActive" value={String(!category.isActive)} />
          <Button type="submit" size="sm" variant={category.isActive ? "secondary" : "default"}>
            {category.isActive ? (
              <PowerOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Power className="h-4 w-4" aria-hidden="true" />
            )}
            {category.isActive ? "Deactivate" : "Activate"}
          </Button>
        </form>
      </td>
    </tr>
  );
}

export function CategoryAdminClient({ categories }: CategoryAdminClientProps) {
  return (
    <div className="grid gap-6">
      <CreateCategoryForm />
      <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-stone-200 px-4 py-3">
          <Pencil className="h-4 w-4 text-emerald-800" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-stone-950">Existing categories</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-left">
            <thead className="bg-stone-50 text-xs uppercase text-stone-500">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Category
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Slug
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Updated
                </th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">
                  Toggle
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <CategoryRow key={category.id} category={category} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
