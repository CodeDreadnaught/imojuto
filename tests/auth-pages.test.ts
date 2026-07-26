import { describe, expect, test } from "vitest";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(8),
});

describe("auth pages validation", () => {
  test("registration accepts valid student staff details", () => {
    expect(registerSchema.parse({ name: "Ada Lovelace", email: "ADA@example.com", password: "password123" })).toMatchObject({
      email: "ada@example.com",
    });
  });

  test("registration rejects short passwords", () => {
    expect(() => registerSchema.parse({ name: "Ada", email: "ada@example.com", password: "short" })).toThrow();
  });
});
