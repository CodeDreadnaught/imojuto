import { describe, expect, test } from "vitest";
import {
  RbacError,
  getSessionCapabilities,
  hasCapability,
  requireCapability,
  type CapabilitySession,
} from "@/lib/rbac";

describe("rbac helpers", () => {
  const adminSession = {
    user: {
      permissions: ["request:assign", "user:manage"],
    },
  } satisfies CapabilitySession;

  test("reads capabilities from the user session payload", () => {
    expect(getSessionCapabilities(adminSession)).toEqual(["request:assign", "user:manage"]);
  });

  test("allows sessions with the required capability", () => {
    expect(hasCapability(adminSession, "request:assign")).toBe(true);
    expect(requireCapability(adminSession, "request:assign")).toBe(adminSession);
  });

  test("throws a typed error when the required capability is missing", () => {
    expect(() => requireCapability(adminSession, "activity:export")).toThrow(RbacError);

    try {
      requireCapability(adminSession, "activity:export");
    } catch (error) {
      expect(error).toBeInstanceOf(RbacError);
      expect(error).toMatchObject({
        capability: "activity:export",
        code: "RBAC_FORBIDDEN",
        status: 403,
      });
    }
  });

  test("supports flattened permissions for route handler adapters", () => {
    const session = {
      permissions: ["request:create"],
    } satisfies CapabilitySession;

    expect(hasCapability(session, "request:create")).toBe(true);
  });
});
