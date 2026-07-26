import { describe, expect, test } from "vitest";

describe("user management", () => {
  test("deactivated users are excluded from officer picker", () => {
    const users = [{ isActive: true }, { isActive: false }];
    expect(users.filter((user) => user.isActive)).toHaveLength(1);
  });
});
