import { describe, expect, test } from "vitest";

const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };

describe("request tracking sorting", () => {
  test("sorts urgent requests first", () => {
    const sorted = ["medium", "urgent", "low", "high"].sort(
      (a, b) => priorityOrder[a as keyof typeof priorityOrder] - priorityOrder[b as keyof typeof priorityOrder],
    );
    expect(sorted).toEqual(["urgent", "high", "medium", "low"]);
  });
});
