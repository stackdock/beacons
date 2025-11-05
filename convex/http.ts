import { httpAction } from "./_generated/server";
import { v } from "convex/values";

/**
 * HTTP Actions
 * 
 * Receives data from external sources:
 * - Cloudflare Workers (beacon monitoring data)
 * - Autumn webhooks (billing events)
 * - Clerk webhooks (user/organization sync)
 */

/**
 * Receive beacon data from Cloudflare Workers
 * 
 * This endpoint receives aggregated health check data from Cloudflare Workers
 * that are monitoring StackDock's internal demo apps on various providers.
 */
export const receiveBeaconData = httpAction(async (ctx, request) => {
  // Validate API key
  const apiKey = request.headers.get("X-Beacon-API-Key");
  const expectedKey = process.env.CONVEX_BEACON_API_KEY;
  
  if (!apiKey || apiKey !== expectedKey) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const data = await request.json();

    // Validate data structure
    if (!Array.isArray(data)) {
      return new Response("Invalid data format", { status: 400 });
    }

    // Store each beacon reading
    for (const reading of data) {
      const {
        provider,
        endpointId,
        region,
        dnsResolutionTime,
        serverResponseTime,
        httpStatus,
        latency,
        isUp,
        timestamp,
      } = reading;

      // Find endpoint
      const endpoint = await ctx.runQuery(
        "beaconEndpoints:getEndpoint",
        { endpointId }
      );

      if (!endpoint) {
        console.warn(`Endpoint ${endpointId} not found, skipping reading`);
        continue;
      }

      // Insert raw data
      await ctx.runMutation("beaconRawData:insert", {
        provider,
        endpointId,
        region,
        dnsResolutionTime,
        serverResponseTime,
        httpStatus,
        latency,
        isUp,
        timestamp: timestamp || Date.now(),
      });
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Error receiving beacon data:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});

/**
 * Handle Autumn webhook events
 * 
 * Receives subscription updates from Autumn billing system.
 */
export const handleAutumnWebhook = httpAction(async (ctx, request) => {
  // Validate webhook secret
  const signature = request.headers.get("X-Autumn-Signature");
  const webhookSecret = process.env.AUTUMN_WEBHOOK_SECRET;
  
  // TODO: Implement signature validation
  // For now, in MVP, we'll trust the webhook
  
  try {
    const event = await request.json();
    
    // Handle different event types
    switch (event.type) {
      case "subscription.created":
      case "subscription.updated":
        // Update organization subscription status
        const orgId = event.data.organizationId; // Assuming Autumn sends this
        await ctx.runMutation("organizations:updateSubscriptionStatus", {
          organizationId: orgId,
          status: event.data.plan === "business" ? "business" : "free",
          subscriptionId: event.data.subscriptionId,
        });
        break;
        
      case "usage.reported":
        // Handle PAYG usage reporting
        // This is handled automatically by Autumn, but we can log it
        break;
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Error handling Autumn webhook:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});
