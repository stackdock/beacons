# StackDock Beacon Network

**Hackathon MVP for Convex/TanStack Hackathon (Due: November 14th)**

A comparison tool that provides StackDock's internal baseline for provider health, helping distinguish between user-specific issues and global provider outages through intelligent alert correlation.

## 🎯 Project Overview

The Beacon Network is an MVP that serves as a "Trojan Horse" funnel for the larger StackDock platform. It demonstrates a viable, scalable business model while leveraging all required sponsor technologies.

## 🏗️ Architecture

This project is a scoped-down implementation of the [StackDock master plan](https://github.com/stackdock/stackdock), adopting core architectural patterns:

- **Universal Table Architecture** - For modeling resources
- **Security Architecture** - Encryption and RBAC
- **Tech Stack** - Convex, TanStack Start, Clerk, shadcn/ui
- **Data Model** - Organizations, Users, Projects

## 🛠️ Tech Stack

### Sponsor Technologies
- **TanStack Start** - Frontend framework
- **Netlify** - Hosting platform
- **Convex** - Backend (database, server functions, auth, scheduled jobs)
- **Cloudflare Workers** - Global monitoring beacons
- **Sentry** - Error monitoring (frontend + backend)
- **CodeRabbit** - AI-powered PR reviews
- **Firecrawl** - Stack discovery and user acquisition hook
- **Autumn** - Subscription and consumption-based billing

### Additional Technologies
- **Clerk** - Authentication & organizations
- **shadcn/ui** - UI component library
- **TypeScript** - Type safety

## 📁 Project Structure

```
beacons/
├── app/                    # TanStack Start frontend
│   ├── routes/            # Route files
│   └── components/        # React components
├── convex/                # Convex backend
│   ├── schema.ts          # Database schema
│   ├── auth.ts            # Authentication
│   ├── organizations.ts   # Organization model
│   ├── users.ts           # User model
│   ├── rbac.ts            # RBAC logic
│   ├── http.ts            # HTTP Actions
│   ├── scheduled.ts       # Scheduled functions
│   ├── queries.ts         # Query functions
│   ├── mutations.ts       # Mutation functions
│   └── actions.ts         # Actions (Firecrawl, etc.)
├── cloudflare/            # Cloudflare Workers
├── project-state/         # Project state JSON files
└── docs/                  # Documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm or pnpm
- Convex account
- Clerk account
- Netlify account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Fill in your API keys and configuration
   ```

4. Initialize Convex:
   ```bash
   npm run convex:dev
   ```

5. Start development server:
   ```bash
   npm run dev
   ```

## 📋 Phases

### Phase 1: The Foundation (Core StackDock Shell)
- Repository setup with CodeRabbit
- Authentication with Convex Auth + Clerk
- Billing integration with Autumn
- RBAC system
- Navigation & UI shell

### Phase 2: The Core "Uptime" Feature & Beacon Network
- Deploy demo apps on providers
- Cloudflare Worker monitoring
- Convex backend correlation engine
- Frontend UI component

### Phase 3: The "Firecrawl" Hook & "Autumn" Metering
- Firecrawl UI component
- Metered credit system
- Dock Registry discovery
- Billing UI

## 💰 Business Model

### Free Team Plan ($0/mo)
- 900 credits/month (30/day)
- Unlimited internal team members
- Hard-capped at organization level

### Business Plan ($19/mo)
- 5,000 credits/month
- Pay-As-You-Go overage ($0.01/credit)
- Priority queue access
- External Client Portal
- Encrypted Client Key features

## 🔒 Security

- All API keys encrypted before storage
- RBAC enforced at Convex layer
- Audit logs for all mutations
- Zero-trust security model

## 📝 License

MIT

## 🤝 Contributing

This is a hackathon submission. All PRs must pass CodeRabbit review.

---

**Built for the Convex/TanStack Hackathon** | Due: November 14th, 2024
