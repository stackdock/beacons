import { action, internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

/**
 * Actions
 * 
 * External API calls and side effects:
 * - Firecrawl API calls
 * - Autumn billing API calls
 * - Sentry error reporting
 */

/**
 * Analyze URL with Firecrawl
 * 
 * This is called from the metered mutation after credit checks pass.
 * It calls the Firecrawl API to extract dependencies from a URL.
 */
export const analyzeUrlWithFirecrawl = action({
  args: {
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const firecrawlApiKey = process.env.FIRECRAWL_API_KEY;
    if (!firecrawlApiKey) {
      throw new Error("Firecrawl API key not configured");
    }

    try {
      // Call Firecrawl API
      const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${firecrawlApiKey}`,
        },
        body: JSON.stringify({
          url: args.url,
          formats: ["html", "links"],
        }),
      });

      if (!response.ok) {
        throw new Error(`Firecrawl API error: ${response.statusText}`);
      }

      const data = await response.json();

      // Extract external resource links
      const links = data.links || [];
      const externalLinks = links.filter((link: string) => {
        try {
          const url = new URL(link);
          // Filter out same-origin links
          return url.origin !== new URL(args.url).origin;
        } catch {
          return false;
        }
      });

      // Identify providers from domains
      const dependencies = externalLinks.map((link: string) => {
        try {
          const url = new URL(link);
          const domain = url.hostname;
          
          // Simple provider identification (can be enhanced)
          let provider = "unknown";
          if (domain.includes("vercel")) provider = "vercel";
          else if (domain.includes("stripe")) provider = "stripe";
          else if (domain.includes("aws") || domain.includes("amazonaws")) provider = "aws";
          else if (domain.includes("cloudflare")) provider = "cloudflare";
          else if (domain.includes("google") && domain.includes("fonts")) provider = "google-fonts";
          else if (domain.includes("sentry")) provider = "sentry";

          return {
            provider,
            resourceUrl: domain,
            resourceType: url.pathname.includes("api") ? "api" : "cdn",
            fullUrl: link,
          };
        } catch {
          return null;
        }
      }).filter(Boolean);

      return {
        success: true,
        dependencies,
        rawData: data,
      };
    } catch (error) {
      console.error("Firecrawl API error:", error);
      throw error;
    }
  },
});

/**
 * Report usage to Autumn for PAYG billing
 * 
 * Called when Business Plan users exceed their 5000 credit bundle.
 */
export const reportUsageToAutumn = internalAction({
  args: {
    organizationId: v.id("organizations"),
    credits: v.number(),
  },
  handler: async (ctx, args) => {
    const autumnApiKey = process.env.AUTUMN_API_KEY;
    if (!autumnApiKey) {
      console.warn("Autumn API key not configured, skipping usage report");
      return;
    }

    const organization = await ctx.runQuery("organizations:getOrganization", {
      organizationId: args.organizationId,
    });

    if (!organization || !organization.autumnSubscriptionId) {
      return;
    }

    try {
      // Report usage to Autumn
      const response = await fetch(`https://api.useautumn.com/v1/usage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${autumnApiKey}`,
        },
        body: JSON.stringify({
          subscriptionId: organization.autumnSubscriptionId,
          quantity: args.credits,
          unit: "credits",
        }),
      });

      if (!response.ok) {
        console.error(`Autumn API error: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error reporting usage to Autumn:", error);
    }
  },
});
