"use client";

import { useActionState } from "react";
import { CheckCircle, FloppyDisk, PencilSimple, Plus, Power, Prohibit } from "@phosphor-icons/react";
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
    <form action={formAction} className="grid gap-4 rounded-lg border border-[#ded5c5] bg-white/90 p-5 shadow-[0_18px_60px_rgba(39,36,31,0.06)]">
      <div className="grid gap-2">
        <label htmlFor="new-category-name" className="text-sm font-semibold text-[#27241f]">
          Name
        </label>
        <Input id="new-category-name" name="name" placeholder="Generator Repairs" required />
        <FieldError messages={state.fieldErrors?.name} />
      </div>
      <div className="grid gap-2">
        <label htmlFor="new-category-description" className="text-sm font-semibold text-[#27241f]">
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
        <p className={state.ok ? "text-sm font-semibold text-[#1d4f43]" : "text-sm font-medium text-[#655c50]"}>
          {state.message || "New categories are active immediately."}
        </p>
        <Button type="submit" disabled={pending}>
          <Plus className="h-4 w-4" weight="bold" aria-hidden="true" />
          {pending ? "Adding" : "Add category"}
        </Button>
      </div>
    </form>
  );
}

function CategoryRow({ category }: { category: Category }) {
  const [state, formAction, pending] = useActionState(updateCategory, initialState);

  return (
    <tr className="border-b border-[#e7dece] align-top last:border-0">
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
                <CheckCircle className="h-4 w-4" weight="duotone" aria-hidden="true" />
              ) : (
                <FloppyDisk className="h-4 w-4" weight="duotone" aria-hidden="true" />
              )}
              {pending ? "Saving" : "Save"}
            </Button>
            {state.message ? (
              <span className={state.ok ? "text-xs font-semibold text-[#1d4f43]" : "text-xs font-medium text-red-700"}>
                {state.message}
              </span>
            ) : null}
          </div>
        </form>
      </td>
      <td className="px-4 py-4 text-sm text-[#655c50]">{category.slug}</td>
      <td className="px-4 py-4">
        <Badge variant={category.isActive ? "success" : "secondary"}>
          {category.isActive ? "Active" : "Inactive"}
        </Badge>
      </td>
      <td className="px-4 py-4 text-sm text-[#655c50]">{category.updatedAt}</td>
      <td className="px-4 py-4 text-right">
        <form action={setCategoryActive}>
          <input type="hidden" name="id" value={category.id} />
          <input type="hidden" name="isActive" value={String(!category.isActive)} />
          <Button type="submit" size="sm" variant={category.isActive ? "secondary" : "default"}>
            {category.isActive ? (
              <Prohibit className="h-4 w-4" weight="duotone" aria-hidden="true" />
            ) : (
              <Power className="h-4 w-4" weight="duotone" aria-hidden="true" />
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
      <div className="overflow-hidden rounded-lg border border-[#ded5c5] bg-white/90 shadow-[0_18px_60px_rgba(39,36,31,0.06)]">
        <div className="flex items-center gap-2 border-b border-[#e7dece] px-4 py-3">
          <PencilSimple className="h-4 w-4 text-[#1d4f43]" weight="duotone" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-[#27241f]">Existing categories</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-left">
            <thead className="bg-[#efe8dc] text-xs uppercase text-[#8a7a67]">
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
