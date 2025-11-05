import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Beacon Endpoints Management
 * 
 * Helper queries for beacon endpoint configuration.
 */

export const getEndpoint = query({
  args: { endpointId: v.id("beaconEndpoints") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.endpointId);
  },
});

export const listActiveEndpoints = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("beaconEndpoints")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});
