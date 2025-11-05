import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * User Management
 * 
 * User queries and operations.
 * Most user management is handled via Clerk + auth.ts syncUser mutation.
 */

/**
 * Get user by ID
 */
export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

/**
 * Get users in an organization
 */
export const getUsersByOrganization = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .collect();
  },
});
