import { Auth } from "convex/server";
import { DataModel } from "./_generated/dataModel";

/**
 * RBAC (Role-Based Access Control) Utilities
 * 
 * Provides middleware and helpers for enforcing permissions.
 * Follows StackDock master plan RBAC patterns.
 */

export type Permission = 
  | "docks:read"
  | "docks:write"
  | "docks:full"
  | "projects:read"
  | "projects:write"
  | "settings:read"
  | "settings:write"
  | "billing:read"
  | "billing:write";

/**
 * Check if user has required permission
 */
export async function hasPermission(
  ctx: { auth: Auth; db: DataModel },
  permission: Permission
): Promise<boolean> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return false;
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", identity.subject))
    .first();

  if (!user) {
    return false;
  }

  // Admin has all permissions
  if (user.role === "admin") {
    return true;
  }

  // Viewer has read-only permissions
  if (user.role === "viewer") {
    return permission.includes(":read");
  }

  return false;
}

/**
 * Check if organization has subscription feature
 */
export async function hasSubscriptionFeature(
  ctx: { auth: Auth; db: DataModel },
  feature: "clientPortal" | "encryptedClientKey" | "payAsYouGo"
): Promise<boolean> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return false;
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", identity.subject))
    .first();

  if (!user) {
    return false;
  }

  const organization = await ctx.db.get(user.organizationId);
  if (!organization) {
    return false;
  }

  // Business plan unlocks all features
  if (organization.autumnSubscriptionStatus === "business") {
    return true;
  }

  // Free plan has no external features
  return false;
}

/**
 * Get user's organization with subscription status
 */
export async function getUserOrganization(
  ctx: { auth: Auth; db: DataModel }
): Promise<{ organizationId: string; subscriptionStatus: "free" | "business" } | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return null;
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", identity.subject))
    .first();

  if (!user) {
    return null;
  }

  const organization = await ctx.db.get(user.organizationId);
  if (!organization) {
    return null;
  }

  return {
    organizationId: organization._id,
    subscriptionStatus: organization.autumnSubscriptionStatus,
  };
}
