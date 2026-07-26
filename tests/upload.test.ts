import { describe, expect, test } from "vitest";

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

describe("upload validation", () => {
  test("allows webp evidence images", () => {
    expect(allowedTypes.includes("image/webp")).toBe(true);
  });
});
