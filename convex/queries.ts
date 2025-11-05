import { query } from "./_generated/server";
import { v } from "convex/values";
import { hasPermission } from "./rbac";

/**
 * Query Functions
 * 
 * Read-only queries for fetching data.
 * All queries should check RBAC permissions.
 */

/**
 * List global provider status (Beacon Network data)
 * 
 * This is called by the frontend to display the Beacon Network status.
 * Public data - no auth required for MVP.
 */
export const listGlobalStatus = query({
  handler: async (ctx) => {
    const statuses = await ctx.db.query("providerStatus").collect();
    return statuses.map((status) => ({
      provider: status.provider,
      status: status.status,
      averageLatency: status.averageLatency,
      lastChecked: status.lastChecked,
    }));
  },
});

/**
 * Get user's monitoring list
 */
export const getUserMonitoringList = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", identity.subject))
      .first();

    if (!user) {
      return [];
    }

    const monitoringList = await ctx.db
      .query("userMonitoringList")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return monitoringList;
  },
});

/**
 * Get organization credit status
 */
export const getOrganizationCredits = query({
  args: {},
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
    if (!organization) {
      return null;
    }

    return {
      creditsUsed: organization.firecrawlCreditsUsed,
      creditsLimit: organization.firecrawlCreditsLimit,
      remaining: organization.firecrawlCreditsLimit - organization.firecrawlCreditsUsed,
      subscriptionStatus: organization.autumnSubscriptionStatus,
    };
  },
});
