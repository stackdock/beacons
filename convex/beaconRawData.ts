import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Beacon Raw Data Management
 * 
 * Helper mutations for storing raw beacon data.
 */

export const insert = mutation({
  args: {
    provider: v.string(),
    endpointId: v.id("beaconEndpoints"),
    region: v.optional(v.string()),
    dnsResolutionTime: v.optional(v.number()),
    serverResponseTime: v.optional(v.number()),
    httpStatus: v.number(),
    latency: v.number(),
    isUp: v.boolean(),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("beaconRawData", {
      ...args,
      createdAt: Date.now(),
    });
  },
});
