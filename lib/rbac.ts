export const capabilities = [
  "request:create",
  "request:read:own",
  "request:read:assigned",
  "request:read:all",
  "request:assign",
  "request:update_status",
  "request:reopen:own",
  "request:reopen:any",
  "category:manage",
  "user:manage",
  "activity:read",
  "activity:export",
] as const;

export type Capability = (typeof capabilities)[number];

export type CapabilitySession = {
  user?: {
    permissions?: readonly string[] | null;
  } | null;
  permissions?: readonly string[] | null;
} | null | undefined;

export class RbacError extends Error {
  readonly capability: Capability;
  readonly code = "RBAC_FORBIDDEN";
  readonly status = 403;

  constructor(capability: Capability) {
    super(`Missing required capability: ${capability}`);
    this.name = "RbacError";
    this.capability = capability;
  }
}

export function getSessionCapabilities(session: CapabilitySession) {
  return session?.user?.permissions ?? session?.permissions ?? [];
}

export function hasCapability(session: CapabilitySession, capability: Capability) {
  return getSessionCapabilities(session).includes(capability);
}

export function requireCapability<TSession extends CapabilitySession>(
  session: TSession,
  capability: Capability,
) {
  if (!hasCapability(session, capability)) {
    throw new RbacError(capability);
  }

  return session;
}

export function isRbacError(error: unknown): error is RbacError {
  return error instanceof RbacError;
}
