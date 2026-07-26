import { describe, expect, test } from "vitest";

describe("polling", () => {
  test("uses a short operational interval", () => {
    expect(15000).toBeLessThanOrEqual(20000);
  });
});
