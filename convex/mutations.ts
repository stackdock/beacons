import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { hasPermission, getUserOrganization } from "./rbac";

/**
 * Mutation Functions
 * 
 * Write operations that modify data.
 * All mutations should check RBAC permissions and audit log.
 */

/**
 * Correlate user error with Beacon Network status
 * 
 * This is called when a Sentry error occurs for a user's monitored resource.
 * It checks the Beacon Network to determine if the issue is user-specific
 * or a global provider outage.
 */
export const correlateErrorWithBeacon = mutation({
  args: {
    provider: v.string(),
    errorMessage: v.string(),
    resourceUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get provider status from Beacon Network
    const providerStatus = await ctx.db
      .query("providerStatus")
      .withIndex("by_provider", (q) => q.eq("provider", args.provider))
      .first();

    // Determine alert level based on correlation
    if (!providerStatus || providerStatus.status === "UP") {
      // Provider is up - this is a user-specific issue
      return {
        alertLevel: "standard",
        message: "Your app issue",
        providerStatus: providerStatus?.status || "UNKNOWN",
        correlation: "user-specific",
      };
    } else {
      // Provider is down or degraded - global outage detected
      return {
        alertLevel: "elevated",
        message: "GLOBAL OUTAGE DETECTED - Our Beacon Network confirms this is a provider-wide issue",
        providerStatus: providerStatus.status,
        correlation: "global-outage",
        beaconConfirmation: true,
      };
    }
  },
});

/**
 * Add resource to user's monitoring list
 */
export const addToMonitoringList = mutation({
  args: {
    provider: v.string(),
    resourceUrl: v.string(),
    resourceType: v.optional(v.string()),
    discoveredVia: v.union(v.literal("firecrawl"), v.literal("manual")),
    sourceUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Check if already in monitoring list
    const existing = await ctx.db
      .query("userMonitoringList")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => 
        q.and(
          q.eq(q.field("provider"), args.provider),
          q.eq(q.field("resourceUrl"), args.resourceUrl)
        )
      )
      .first();

    if (existing) {
      return existing._id;
    }

    // Add to monitoring list
    const monitoringId = await ctx.db.insert("userMonitoringList", {
      userId: user._id,
      organizationId: user.organizationId,
      provider: args.provider,
      resourceUrl: args.resourceUrl,
      resourceType: args.resourceType,
      discoveredVia: args.discoveredVia,
      sourceUrl: args.sourceUrl,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Audit log
    await ctx.db.insert("auditLogs", {
      userId: user._id,
      organizationId: user.organizationId,
      action: "monitoring.add",
      status: "success",
      metadata: { provider: args.provider, resourceUrl: args.resourceUrl },
      timestamp: Date.now(),
    });

    return monitoringId;
  },
});
