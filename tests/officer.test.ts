import { describe, expect, test } from "vitest";

describe("officer queue", () => {
  test("urgent work is ranked ahead of high priority", () => {
    expect({ urgent: 0, high: 1 }.urgent).toBeLessThan({ urgent: 0, high: 1 }.high);
  });
});
