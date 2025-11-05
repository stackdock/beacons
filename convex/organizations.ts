import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Organization Management
 * 
 * Handles organization-level operations including:
 * - Credit tracking
 * - Subscription status
 * - Billing integration
 */

/**
 * Get organization by ID
 */
export const getOrganization = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.organizationId);
  },
});

/**
 * Get organization by Clerk organization ID
 */
export const getOrganizationByClerkId = query({
  args: { clerkOrganizationId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("organizations")
      .withIndex("by_clerk_org_id", (q) => q.eq("clerkOrganizationId", args.clerkOrganizationId))
      .first();
  },
});

/**
 * Update subscription status (called by Autumn webhook)
 */
export const updateSubscriptionStatus = mutation({
  args: {
    organizationId: v.id("organizations"),
    status: v.union(v.literal("free"), v.literal("business")),
    subscriptionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const organization = await ctx.db.get(args.organizationId);
    if (!organization) {
      throw new Error("Organization not found");
    }

    const creditsLimit = args.status === "business" ? 5000 : 900;

    await ctx.db.patch(args.organizationId, {
      autumnSubscriptionStatus: args.status,
      autumnSubscriptionId: args.subscriptionId,
      firecrawlCreditsLimit: creditsLimit,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Increment Firecrawl credits used
 */
export const incrementFirecrawlCredits = mutation({
  args: {
    organizationId: v.id("organizations"),
    credits: v.number(),
  },
  handler: async (ctx, args) => {
    const organization = await ctx.db.get(args.organizationId);
    if (!organization) {
      throw new Error("Organization not found");
    }

    const newCreditsUsed = organization.firecrawlCreditsUsed + args.credits;

    await ctx.db.patch(args.organizationId, {
      firecrawlCreditsUsed: newCreditsUsed,
      updatedAt: Date.now(),
    });

    return {
      creditsUsed: newCreditsUsed,
      creditsLimit: organization.firecrawlCreditsLimit,
      hasReachedLimit: newCreditsUsed >= organization.firecrawlCreditsLimit,
    };
  },
});

/**
 * Reset monthly credits (called by scheduled function)
 */
export const resetMonthlyCredits = mutation({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const organization = await ctx.db.get(args.organizationId);
    if (!organization) {
      throw new Error("Organization not found");
    }

    await ctx.db.patch(args.organizationId, {
      firecrawlCreditsUsed: 0,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});
