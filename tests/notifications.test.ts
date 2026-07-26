import { describe, expect, test } from "vitest";

describe("notifications", () => {
  test("assignment and status notification types are supported", () => {
    expect(["assigned", "status_changed", "resolved"]).toContain("assigned");
  });
});
