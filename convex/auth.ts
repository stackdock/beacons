import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Authentication Utilities
 * 
 * Integrates Convex Auth with Clerk for organization and user management.
 * Follows patterns from StackDock master plan ARCHITECTURE.md
 */

/**
 * Get the current authenticated user
 */
export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    // Find user by Clerk user ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", identity.subject))
      .first();

    return user;
  },
});

/**
 * Get the current user's organization
 */
export const getCurrentOrganization = query({
  handler: async (ctx) => {
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
    return organization;
  },
});

/**
 * Create or update user from Clerk webhook
 * This will be called when Clerk syncs user/organization data
 */
export const syncUser = mutation({
  args: {
    clerkUserId: v.string(),
    clerkOrganizationId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    role: v.optional(v.union(v.literal("admin"), v.literal("viewer"))),
  },
  handler: async (ctx, args) => {
    // Find or create organization
    let organization = await ctx.db
      .query("organizations")
      .withIndex("by_clerk_org_id", (q) => q.eq("clerkOrganizationId", args.clerkOrganizationId))
      .first();

    if (!organization) {
      const orgId = await ctx.db.insert("organizations", {
        name: args.clerkOrganizationId, // TODO: Get actual org name from Clerk
        clerkOrganizationId: args.clerkOrganizationId,
        autumnSubscriptionStatus: "free",
        firecrawlCreditsUsed: 0,
        firecrawlCreditsLimit: 900, // Free plan default
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      organization = await ctx.db.get(orgId);
    }

    if (!organization) {
      throw new Error("Failed to create organization");
    }

    // Find or create user
    let user = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .first();

    if (user) {
      // Update existing user
      await ctx.db.patch(user._id, {
        organizationId: organization._id,
        email: args.email,
        name: args.name,
        role: args.role || user.role,
        updatedAt: Date.now(),
      });
      return user._id;
    } else {
      // Create new user
      const userId = await ctx.db.insert("users", {
        clerkUserId: args.clerkUserId,
        organizationId: organization._id,
        email: args.email,
        name: args.name,
        role: args.role || "viewer",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      return userId;
    }
  },
});
