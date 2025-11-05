import { internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

/**
 * Scheduled Functions
 * 
 * Runs on a schedule to:
 * - Aggregate beacon raw data into provider status
 * - Reset monthly credits
 * - Clean up old data
 */

/**
 * Aggregate beacon raw data into provider status
 * 
 * This runs periodically (e.g., every 5 minutes) to process raw beacon data
 * and update the provider_status table with current health status.
 */
export const aggregateBeaconData = internalMutation({
  handler: async (ctx) => {
    // Get all active providers from beacon endpoints
    const endpoints = await ctx.db
      .query("beaconEndpoints")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    for (const endpoint of endpoints) {
      // Get recent readings (last 15 minutes)
      const fifteenMinutesAgo = Date.now() - 15 * 60 * 1000;
      const recentReadings = await ctx.db
        .query("beaconRawData")
        .withIndex("by_endpoint", (q) => q.eq("endpointId", endpoint._id))
        .filter((q) => q.gte(q.field("timestamp"), fifteenMinutesAgo))
        .collect();

      if (recentReadings.length === 0) {
        continue;
      }

      // Calculate aggregate metrics
      const totalLatency = recentReadings.reduce((sum, r) => sum + r.latency, 0);
      const averageLatency = totalLatency / recentReadings.length;
      const upCount = recentReadings.filter((r) => r.isUp).length;
      const upPercentage = (upCount / recentReadings.length) * 100;

      // Determine status
      let status: "UP" | "DOWN" | "DEGRADED";
      if (upPercentage >= 95) {
        status = "UP";
      } else if (upPercentage >= 50) {
        status = "DEGRADED";
      } else {
        status = "DOWN";
      }

      // Update or create provider status
      const existingStatus = await ctx.db
        .query("providerStatus")
        .withIndex("by_provider", (q) => q.eq("provider", endpoint.provider))
        .first();

      if (existingStatus) {
        await ctx.db.patch(existingStatus._id, {
          status,
          averageLatency,
          lastChecked: Date.now(),
          updatedAt: Date.now(),
        });
      } else {
        await ctx.db.insert("providerStatus", {
          provider: endpoint.provider,
          status,
          averageLatency,
          lastChecked: Date.now(),
          updatedAt: Date.now(),
        });
      }
    }
  },
});

/**
 * Reset monthly credits for all organizations
 * 
 * This runs monthly (e.g., on the 1st of each month) to reset credit counters.
 */
export const resetMonthlyCredits = internalMutation({
  handler: async (ctx) => {
    const organizations = await ctx.db.query("organizations").collect();

    for (const org of organizations) {
      await ctx.db.patch(org._id, {
        firecrawlCreditsUsed: 0,
        updatedAt: Date.now(),
      });
    }
  },
});
