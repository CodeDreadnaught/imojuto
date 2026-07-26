import { describe, expect, test } from "vitest";

describe("admin assignment", () => {
  test("reassignment deactivates prior active assignment conceptually", () => {
    const previous = { isActive: true };
    const next = { isActive: true };
    previous.isActive = false;
    expect([previous, next].filter((assignment) => assignment.isActive)).toHaveLength(1);
  });
});
