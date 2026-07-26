import { describe, expect, test } from "vitest";
import { RequestCategory } from "@/models";

describe("request categories", () => {
  test("new categories default to active", async () => {
    const category = new RequestCategory({ name: "Generator Repairs", slug: "generator-repairs" });

    await expect(category.validate()).resolves.toBeUndefined();
    expect(category.isActive).toBe(true);
  });

  test("inactive categories remain valid for historical references", async () => {
    const category = new RequestCategory({
      name: "Old Internet",
      slug: "old-internet",
      isActive: false,
    });

    await expect(category.validate()).resolves.toBeUndefined();
    expect(category.isActive).toBe(false);
  });
});
