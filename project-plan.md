# Project Plan: StackDock "Beacon Network" (Hackathon MVP)

## 1. Objective

https://www.convex.dev/hackathons/tanstack

Generate a comprehensive, step-by-step implementation plan for a new application, the "Beacon Network." This project is a Hackathon Submission for the Convex/TanStack Hackathon (due November 14th) and must leverage all required sponsor technologies.

This project will serve as the MVP and "Trojan Horse" funnel for the larger StackDock platform. The plan must be executable within a tight deadline (approx. 10 days) and demonstrate a viable, scalable business model.

## 2. Core Context: The "StackDock" Master Plan

This new project's architecture must be a direct, scoped-down implementation of the existing https://github.com/stackdock/stackdock `stackdock/stackdock` master plan. The implementation must reuse the core concepts defined in the following artifacts:

* **`ARCHITECTURE.md`:** This is the primary source of truth. The plan must adopt its core architectural patterns:
    * The "Universal Table Architecture" (for modeling resources).
    * The "Security Architecture" (encryption, RBAC).
    * The "Tech Stack" (Convex, TanStack, Clerk, shadcn/ui).
    * The "Data Model" (Organizations, Users, Projects).
* **GitHub Issues (Conceptually):**
    * "Implement Simplified Top-Level Navigation" (for the route structure).
    * "Implement RBAC" (for the user/team/client model).
    * "Implement Modular Provider Adapter Library" (for the backend logic structure).
* **`README.md`:** Must align with the "Composable Cloud" and "Home Port" vision.

### **Important: Repository Isolation Strategy**

**This repository must remain completely isolated** from the `stackdock/stackdock` master plan repository. To achieve this while reusing architectural patterns:

**Local Path Reference:** The master plan repository is located at `C:\Users\veter\Desktop\DEV\github\next\stackdock` (local reference only, not a dependency).

1. **Reference Only (No Git Dependencies):**
    * Do NOT use git submodules, npm packages, or any direct repository dependencies
    * Treat the local `stackdock` repo as **reference documentation only**
    * **CRITICAL: Review ALL markdown documentation files** in `C:\Users\veter\Desktop\DEV\github\next\stackdock`:
        * Review `ARCHITECTURE.md` to understand the full architectural vision
        * Review `README.md` to understand the "Composable Cloud" and "Home Port" vision
        * Review any other `.md` files (GitHub Issues, design docs, etc.)
        * **Understand the difference:** What the full StackDock platform WILL BE vs. what we need for the hackathon MVP
        * **Focus on:** Extracting only the core patterns, simplified implementations, and MVP-scoped features
        * **Skip:** Advanced features, future roadmap items, complexity beyond MVP needs
    * After understanding the vision, identify the minimal viable patterns needed for this hackathon submission

2. **Manual Code Extraction Process:**
    * Navigate to `C:\Users\veter\Desktop\DEV\github\next\stackdock` to review code
    * With MVP scope in mind, identify specific utility functions, schema patterns, or adapter code
    * **Speed Optimization:** Extract only what's needed to build the Beacon Network MVP quickly
    * Copy the relevant code files directly into this repo (manual copy-paste)
    * Adapt the code to fit the MVP scope (remove unnecessary complexity, simplify implementations)
    * Update imports, namespaces, and file paths to match this repo's structure
    * Add attribution comments if needed: `// Adapted from stackdock/stackdock`

3. **What to Extract (Examples):**
    * Convex schema patterns (Universal Table Architecture)
    * RBAC helper functions and type definitions
    * Provider adapter patterns (simplified for MVP)
    * Authentication utilities (Clerk integration patterns)
    * TypeScript types and interfaces

4. **What NOT to Extract:**
    * Unused features or complexity beyond MVP scope
    * Infrastructure configs specific to the master repo
    * Dependencies that aren't part of the hackathon tech stack

5. **Validation:**
    * Ensure this repo has zero git dependencies on `stackdock/stackdock`
    * All code should be self-contained within this repository
    * Verify with `git submodule status` and `package.json` checks that no cross-repo dependencies exist

## 3. Hackathon Requirements (Sponsor Technologies)

The generated plan must include a clear implementation path for *all* of the following sponsor technologies:

* **TanStack Start:** The frontend framework. https://tanstack.com/start/latest/docs/framework/react/overview 
* **Netlify:** The hosting platform for the TanStack Start frontend. https://docs.netlify.com/
* **Convex:** The entire backend (database, server functions, auth, scheduled jobs). https://docs.convex.dev/home
* **Cloudflare:** For DNS and specifically Cloudflare Workers (as a global monitoring beacon). https://developers.cloudflare.com/
* **Sentry:** For error monitoring on *both* the TanStack frontend and the Convex backend. https://docs.sentry.io/
* **CodeRabbit:** For AI-powered PR reviews on the new repository. https://docs.coderabbit.ai/overview/introduction
* **Firecrawl:** As the key, "magic" user-acquisition hook. https://docs.firecrawl.dev/introduction 
* **Autumn:** For subscription and consumption-based (overage) billing. https://docs.useautumn.com/welcome

## 4. Functional Plan for the "Beacon Network"

The plan must detail the steps to build the following functionality, structured into a "Free Team Plan" and a "Paid Business Plan" to create the funnel.

---

### Phase 1: The Foundation (Core StackDock Shell)

1.  **Repo & CI:**
    * Initialize the new project repository (ensure it's isolated - no git submodules or cross-repo dependencies).
    * Install **CodeRabbit** on the repo. All PRs must pass CodeRabbit review.
    * **Reference Extraction:** Review local `stackdock` repo at `C:\Users\veter\Desktop\DEV\github\next\stackdock`:
        * **First: Review ALL markdown documentation** (`ARCHITECTURE.md`, `README.md`, GitHub Issues, etc.)
        * **Understand the full vision** (what StackDock WILL BE) vs. **MVP needs** (what we need for hackathon speed)
        * Extract only core patterns needed for Beacon Network MVP - skip advanced features and future roadmap items
        * Open `ARCHITECTURE.md` to understand core patterns, then identify minimal viable implementations
        * Copy relevant schema patterns, type definitions, and utility functions manually
        * Adapt code to MVP scope (remove unnecessary complexity, simplify for speed)
        * Ensure all code is self-contained within this repository
        * Verify isolation: run `git submodule status` and check `package.json` for any references to stackdock repo
2.  **Auth, Billing & RBAC (The Core Funnel):**
    * Integrate **Convex Auth** and **Clerk** as defined in `ARCHITECTURE.md` to manage Organizations, Users, and Roles.
    * Integrate the **Autumn** SDK. Configure two plans in the Autumn dashboard:
        * **"Free Team Plan"** ($0/mo): Includes 900 credits/month (30/day), hard-capped at organization level.
        * **"Business Plan"** ($19/mo): Includes 5,000 credits/month, unlocks Pay-As-You-Go (PAYG) overage, and priority queue.
    * Implement the core RBAC logic in Convex, based on the GitHub issue:
        * The "Free Team Plan" allows unlimited *internal* team members (e.g., `Admin`, `Viewer` roles).
        * The "Business Plan" (which requires a valid Autumn subscription) unlocks the *external* "Client Portal" and "Encrypted Client Key" features.
    * The Convex user/organization model must store:
        * `autumnSubscriptionStatus` (e.g., "free", "business")
        * `firecrawlCreditsUsed` (counter for organization-level credit tracking)
        * `firecrawlCreditsLimit` (based on plan: 900 for free, 5000 for business)
3.  **Navigation & UI Shell:**
    * Implement the **Top-Level Navigation** structure from the GitHub issue:
        * `/dashboard`
        * `/projects`
        * `/infrastructure`
        * `/operations`
        * `/settings`
    * Build this static shell using **TanStack Start** and **shadcn/ui**.
    * Deploy the static shell to **Netlify** for continuous previews and final hosting.
    * Integrate **Sentry** with the TanStack Start frontend to capture all UI-side errors.

---

### Phase 2: The Core "Uptime" Feature & Beacon Network

**Architecture Overview:** The Beacon Network is a **comparison tool** that provides StackDock's internal baseline for provider health. It helps distinguish between user-specific issues and global provider outages, enabling intelligent alert correlation. The UI is displayed as an **in-app flyout/component** (button that opens a sheet/modal), not a standalone page.

1.  **Deploy StackDock's Internal Beacon Network (Infrastructure Setup):**
    * Deploy small "hello world" demo apps/servers on each major provider:
        * AWS (EC2 or Lambda with API Gateway)
        * Vercel (Edge Function)
        * Cloudflare (Workers)
        * DigitalOcean (Droplet)
        * Other providers as available
    * Each demo app must expose a health check endpoint (e.g., `/health` or `/api/beacon`)
    * These become StackDock's "canary deployments" - internal monitoring nodes that verify DNS and server availability
    * Store demo app URLs/endpoints in Convex configuration table (`beacon_endpoints`) for reference

2.  **The Cloudflare Worker Beacons:**
    * Create a **Cloudflare Worker** configured with a cron trigger (e.g., every 5 minutes)
    * This Worker pings each StackDock demo app's health endpoint (from step 1)
    * For each provider, measure:
        * DNS resolution time
        * Server response time
        * HTTP status code
        * Latency metrics
    * Collect data from multiple Cloudflare Worker regions for global coverage
    * Send aggregated JSON data to Convex HTTP Action endpoint

3.  **The Convex Backend (Correlation Engine):**
    * Create a **Convex HTTP Action** (API endpoint) to securely receive JSON data from Cloudflare Worker beacons:
        * Validate incoming requests (API key authentication)
        * Store raw beacon data in `beacon_raw_data` table with timestamp and provider info
    * Create a **Convex Scheduled Function** to aggregate raw beacon data into a clean, queryable `provider_status` table:
        * Provider name (e.g., "Vercel", "AWS", "Cloudflare")
        * Current status (UP/DOWN/DEGRADED)
        * Average latency
        * Last checked timestamp
        * Region breakdown (if available)
    * Create a **Convex Query Function** (`listGlobalStatus`) that the frontend calls for real-time Beacon Network data
    * Create a **Convex Mutation** (`correlateErrorWithBeacon`) that:
        * Takes a Sentry error/alert from user's monitored resources
        * Checks the current `provider_status` for the relevant provider
        * Determines if issue is user-specific or global provider outage
        * Returns correlation result with alert level (standard vs. elevated)
        * **If provider is UP:** Issue is user-specific → Standard alert level
        * **If provider is DOWN:** Global outage detected → Elevated alert level + Beacon confirmation message
    * Integrate **Sentry** with all Convex functions (HTTP Action, Scheduled Function, Queries, Mutations) to monitor for *all* backend errors

4.  **The Frontend UI (In-App Component):**
    * Create a button/trigger on `/operations/global-status` page that opens a flyout/sheet component
    * This flyout component displays the Beacon Network status using TanStack Query (`useSuspenseQuery`) to call `listGlobalStatus`
    * Show real-time provider status with visual indicators (UP/DOWN/DEGRADED)
    * When user errors occur (from Sentry), display correlation results:
        * "Your app issue" (when Beacon Network shows provider is UP)
        * "GLOBAL OUTAGE DETECTED - Our Beacon Network confirms this is a provider-wide issue" (when Beacon Network shows provider is DOWN)
    * Use **shadcn/ui** Sheet/Modal component for the flyout
    * Ensure the component updates in real-time via Convex subscriptions

---

### Phase 3: The "Firecrawl" Hook & "Autumn" Metering

This is the key acquisition loop and abuse-prevention model. **CRITICAL UX PRINCIPLE:** Never admit failure when Firecrawl misses technologies. Instead, use it as a feature discovery moment for the Dock Registry.

1.  **The "Magic" UI:**
    * Plan the UI component (e.g., on the main `/dashboard`) with an input field: "Analyze Your Site's Dependencies."
    * Display the user's current credit quota prominently: `firecrawlCreditsUsed` / `firecrawlCreditsLimit`
    * Show plan type and remaining credits
    * **Note:** Firecrawl scan is NOT a requirement - it's an optional upsell hook

2.  **The Metered Convex Function:**
    * Plan a Convex mutation/action that takes a user's URL.
    * **Crucial Logic:** This function must first check the user's organization (`orgId`).
    * It reads the `autumnSubscriptionStatus` and `firecrawlCreditsUsed` from the organization's record.
    * **If "Free Team Plan":**
        * Check if `firecrawlCreditsUsed < 900` (the free monthly limit, billed as 30/day).
        * If yes: Proceed.
        * If no: Return an error: "Free credit limit reached. Please upgrade to the Business Plan for more credits."
    * **If "Business Plan":**
        * Check if `firecrawlCreditsUsed < 5000` (the monthly bundle limit).
        * If under limit: Proceed (uses bundled credits).
        * If over limit: Proceed but report usage to Autumn for PAYG overage billing.

3.  **The Firecrawl Call:**
    * The Convex function calls the **Firecrawl API** to crawl the URL and extract all external resource links (e.g., `api.stripe.com`, `fonts.google.com`, `vercel.com`).
    * Firecrawl identifies providers/services that the user's site depends on.

4.  **The Logic & Reporting (CRITICAL - Never Admit Failure):**
    * The function takes the list of dependencies from Firecrawl and adds them to the user's *personal* monitoring list.
    * It increments the `firecrawlCreditsUsed` counter for the organization in the Convex DB.
    * **CRITICAL UX FLOW:** When displaying results to the user:
        * **If Firecrawl found technologies:** "Scan complete! We've pre-configured your [Provider1] and [Provider2] dashboards."
        * **If Firecrawl missed technologies OR user wants to add more:** Display message: "If something isn't here or you would like to ADD, click '+ Add A Provider' to see the Docks we support (GridPane, DigitalOcean, etc.) and connect them manually."
        * Show tabs for: Available Docks, In-Development Docks, Scoping Requests
        * **WE DO NOT ADMIT FAILURE** - Instead, turn this into a feature discovery moment that reveals the Dock Registry's power
    * **If "Business Plan":** For any credits used beyond the 5,000 bundle, call **`autumn.reportUsage(...)`** to report consumption. PAYG overage pricing: $0.01 per credit (or $10 per 1,000 credits).

5.  **The Frontend Billing UI:**
    * The UI must show the user their current `firecrawlCreditsUsed` and their plan's limit (900 for free, 5,000 for business).
    * Display remaining credits clearly: "X credits remaining this month"
    * If the user hits the free limit, the UI must present an "Upgrade" button that links directly to the **Autumn** checkout page for the "$19/mo Business Plan."
    * The Business Plan billing page (managed by Autumn) will clearly state:
        * "Includes 5,000 Firecrawl credits/month"
        * "Pay-As-You-Go overage: $0.01 per credit ($10 per 1,000 credits)"
        * "Priority queue access included"
    * **Credit System Philosophy:** Organization-level credit pool forces teams to collaborate and manage usage together, creating natural upgrade pressure when limits are reached.

## 6. Output Format

Generate a single, comprehensive markdown file. Use clear headings, bullet points, and step-by-step instructions for each phase. The plan must be a direct, actionable guide for me to start building immediately.
