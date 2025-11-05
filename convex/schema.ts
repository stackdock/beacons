import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Universal Table Architecture Schema
 * 
 * This schema follows the StackDock master plan patterns:
 * - Universal tables that accept any provider via `provider` field
 * - Provider-specific data stored in `fullApiData`
 * - RBAC enforcement at query/mutation level
 */

export default defineSchema({
  // Organizations - Top-level entity for billing and team management
  organizations: defineTable({
    name: v.string(),
    clerkOrganizationId: v.string(),
    
    // Billing & Subscription
    autumnSubscriptionStatus: v.union(v.literal("free"), v.literal("business")),
    autumnSubscriptionId: v.optional(v.string()),
    firecrawlCreditsUsed: v.number(), // Organization-level credit counter
    firecrawlCreditsLimit: v.number(), // 900 for free, 5000 for business
    
    // Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerk_org_id", ["clerkOrganizationId"])
    .index("by_subscription_status", ["autumnSubscriptionStatus"]),

  // Users - Linked to organizations
  users: defineTable({
    clerkUserId: v.string(),
    organizationId: v.id("organizations"),
    email: v.string(),
    name: v.optional(v.string()),
    role: v.union(v.literal("admin"), v.literal("viewer")),
    
    // Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerk_user_id", ["clerkUserId"])
    .index("by_organization", ["organizationId"]),

  // Projects - User-created projects
  projects: defineTable({
    organizationId: v.id("organizations"),
    name: v.string(),
    description: v.optional(v.string()),
    
    // Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organization", ["organizationId"]),

  // Beacon Endpoints - Configuration for StackDock's internal monitoring nodes
  beaconEndpoints: defineTable({
    provider: v.string(), // e.g., "vercel", "aws", "cloudflare"
    url: v.string(), // Health check endpoint URL
    region: v.optional(v.string()),
    isActive: v.boolean(),
    
    // Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_provider", ["provider"])
    .index("by_active", ["isActive"]),

  // Beacon Raw Data - Raw health check data from Cloudflare Workers
  beaconRawData: defineTable({
    provider: v.string(),
    endpointId: v.id("beaconEndpoints"),
    region: v.optional(v.string()),
    
    // Metrics
    dnsResolutionTime: v.optional(v.number()), // milliseconds
    serverResponseTime: v.optional(v.number()), // milliseconds
    httpStatus: v.number(),
    latency: v.number(), // milliseconds
    isUp: v.boolean(),
    
    // Metadata
    timestamp: v.number(),
    createdAt: v.number(),
  })
    .index("by_provider", ["provider"])
    .index("by_timestamp", ["timestamp"])
    .index("by_endpoint", ["endpointId"]),

  // Provider Status - Aggregated provider health status
  providerStatus: defineTable({
    provider: v.string(),
    status: v.union(v.literal("UP"), v.literal("DOWN"), v.literal("DEGRADED")),
    averageLatency: v.number(), // milliseconds
    lastChecked: v.number(), // timestamp
    regionBreakdown: v.optional(v.any()), // Map of region -> status
    
    // Metadata
    updatedAt: v.number(),
  })
    .index("by_provider", ["provider"])
    .index("by_status", ["status"]),

  // User Monitoring List - Dependencies discovered via Firecrawl
  userMonitoringList: defineTable({
    userId: v.id("users"),
    organizationId: v.id("organizations"),
    provider: v.string(), // e.g., "vercel", "stripe", "aws"
    resourceUrl: v.string(), // e.g., "api.stripe.com", "fonts.google.com"
    resourceType: v.optional(v.string()), // e.g., "api", "cdn", "font"
    
    // Source tracking
    discoveredVia: v.union(v.literal("firecrawl"), v.literal("manual")),
    sourceUrl: v.optional(v.string()), // Original URL that contained this dependency
    
    // Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_organization", ["organizationId"])
    .index("by_provider", ["provider"]),

  // Audit Logs - Track all important actions
  auditLogs: defineTable({
    userId: v.id("users"),
    organizationId: v.id("organizations"),
    action: v.string(), // e.g., "dock.create", "firecrawl.scan"
    status: v.union(v.literal("success"), v.literal("failure"), v.literal("error")),
    metadata: v.optional(v.any()),
    
    // Metadata
    timestamp: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_organization", ["organizationId"])
    .index("by_action", ["action"])
    .index("by_timestamp", ["timestamp"]),
});
