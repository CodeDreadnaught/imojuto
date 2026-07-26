import { describe, expect, test } from "vitest";
import { z } from "zod";

const priorities = ["low", "medium", "high", "urgent"] as const;

describe("request submission validation", () => {
  test("accepts urgent as a valid priority", () => {
    expect(z.enum(priorities).parse("urgent")).toBe("urgent");
  });

  test("rejects missing title", () => {
    expect(() => z.string().trim().min(4).parse("")).toThrow();
  });
});
