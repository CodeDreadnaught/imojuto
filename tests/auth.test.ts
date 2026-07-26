import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { getRouteGateDecision } from "@/proxy";

const mocks = vi.hoisted(() => ({
  connectDb: vi.fn(),
  userLean: vi.fn(),
  roleLean: vi.fn(),
}));

vi.mock("next-auth", () => ({
  default: vi.fn(() => ({
    handlers: {
      GET: vi.fn(),
      POST: vi.fn(),
    },
    auth: vi.fn((handler) => handler),
    signIn: vi.fn(),
    signOut: vi.fn(),
    unstable_update: vi.fn(),
  })),
}));

vi.mock("next-auth/providers/credentials", () => ({
  default: vi.fn((config) => config),
}));

vi.mock("@/lib/db", () => ({
  connectDb: mocks.connectDb,
}));

vi.mock("@/models", () => ({
  User: {
    findOne: vi.fn(() => ({ lean: mocks.userLean })),
  },
  Role: {
    findById: vi.fn(() => ({ lean: mocks.roleLean })),
  },
}));

describe("auth credentials", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("returns a user with role permissions for valid credentials", async () => {
    const { authorizeUserCredentials } = await import("@/auth");
    const userId = new mongoose.Types.ObjectId();
    const roleId = new mongoose.Types.ObjectId();
    const passwordHash = await bcrypt.hash("correct-password", 4);

    mocks.userLean.mockResolvedValue({
      _id: userId,
      name: "System Administrator",
      email: "admin@example.com",
      passwordHash,
      roleId,
      isActive: true,
    });
    mocks.roleLean.mockResolvedValue({
      _id: roleId,
      name: "admin",
      label: "Administrator",
      permissions: ["request:assign", "user:manage"],
    });

    await expect(
      authorizeUserCredentials({ email: "ADMIN@example.com", password: "correct-password" }),
    ).resolves.toMatchObject({
      id: String(userId),
      userId: String(userId),
      roleId: String(roleId),
      permissions: ["request:assign", "user:manage"],
    });
  });

  test("rejects deactivated users", async () => {
    const { authorizeUserCredentials } = await import("@/auth");
    mocks.userLean.mockResolvedValue({
      _id: new mongoose.Types.ObjectId(),
      name: "Dormant User",
      email: "user@example.com",
      passwordHash: await bcrypt.hash("correct-password", 4),
      roleId: new mongoose.Types.ObjectId(),
      isActive: false,
    });

    await expect(
      authorizeUserCredentials({ email: "user@example.com", password: "correct-password" }),
    ).resolves.toBeNull();
  });
});

describe("proxy route gating", () => {
  test("redirects unauthenticated protected requests to login", () => {
    expect(getRouteGateDecision(null, new URL("https://imojuto.test/requests?status=open"))).toEqual({
      kind: "login",
      callbackUrl: "/requests?status=open",
    });
  });

  test("rejects non-admin users on admin routes", () => {
    expect(
      getRouteGateDecision(
        { user: { roleId: "role-student", permissions: ["request:create"] } },
        new URL("https://imojuto.test/admin/users"),
      ),
    ).toEqual({ kind: "forbidden" });
  });

  test("allows admin users on admin routes", () => {
    expect(
      getRouteGateDecision(
        { user: { roleId: "role-admin", permissions: ["user:manage"] } },
        new URL("https://imojuto.test/admin/users"),
      ),
    ).toEqual({ kind: "allow" });
  });
});
