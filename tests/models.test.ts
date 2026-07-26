import { describe, expect, test } from "vitest";
import mongoose from "mongoose";
import { RequestCategory, Role, ServiceRequest, User } from "@/models";

describe("models", () => {
  test("role rejects unknown names", async () => {
    const role = new Role({ name: "super_admin", label: "Super", permissions: [] });
    await expect(role.validate()).rejects.toMatchObject({ errors: { name: expect.anything() } });
  });

  test("user requires role relationship", async () => {
    const user = new User({ name: "Ada", email: "ada@example.com", passwordHash: "hash" });
    await expect(user.validate()).rejects.toMatchObject({ errors: { roleId: expect.anything() } });
  });

  test("category requires slug", async () => {
    const category = new RequestCategory({ name: "Electrical" });
    await expect(category.validate()).rejects.toMatchObject({ errors: { slug: expect.anything() } });
  });

  test("service request validates priority and status", async () => {
    const request = new ServiceRequest({
      referenceCode: "IMJ-2026-000001",
      title: "Broken socket",
      description: "The wall socket sparked during use.",
      categoryId: new mongoose.Types.ObjectId(),
      requesterId: new mongoose.Types.ObjectId(),
      location: { building: "Block A", roomOrArea: "Room 12" },
      priority: "critical",
      status: "waiting",
    });

    await expect(request.validate()).rejects.toMatchObject({
      errors: {
        priority: expect.anything(),
        status: expect.anything(),
      },
    });
  });
});
