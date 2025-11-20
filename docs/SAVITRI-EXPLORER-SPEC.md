# Savitri Explorer · Comprehensive Technical Specification

This document consolidates every insight gathered from the provided repository. It is intended for product owners, technical architects, and engineering teams who must turn the current prototype (API proxies only) into a production-ready blockchain explorer.

---

## 1. Purpose & Vision

### Mission
Savitri Explorer aims to become the canonical block explorer for the Savitri network (a proprietary, likely layer-1 chain). The platform must guarantee operational transparency, trustworthy transaction auditing, and advanced tooling for smart-contract engineers. It aggregates intelligence across blocks, transactions, accounts, and smart-contract executions so any Savitri stakeholder can rely on it as a single source of truth.

### Target Users
- **Validators & node operators**: monitor finality, producers, synchronization, node health.
- **Smart-contract developers**: inspect logs, events, bytecode, ABI-decoded payloads, traces.
- **Power / retail users**: search transactions, confirm balances, inspect gas usage and fees.
- **Compliance & audit teams**: cross-check large on-chain datasets for reporting and investigations.

### Example Usage Scenarios
1. Paste a transaction hash to confirm state, fees, logs, and events.
2. Monitor the latest block, validator attribution, and throughput charts.
3. Debug smart contracts by reviewing emitted events and deployed bytecode.
4. Analyze an account by retrieving its full paginated transaction history.

### Blockchain Connectivity
Every existing server route (`app/api/...`) is a proxy toward a proprietary Savitri backend, composed via the missing helper `buildApiUrl()` from `@/utils/serverEnv`. Domains currently addressed:
- `tx/pk` → paginated account-level transactions
- `tx/hash` → transaction details
- `block/hash` → block details
- `block/ts` → block aggregations grouped by timestamp
- `sc/:id` → smart-contract metadata/code

---

## 2. Features Implemented (API Layer Only)

> The repository only contains a handful of Next.js App Router API routes. No UI or configuration exists yet; each route acts as a direct proxy to the Savitri backend and currently fails to compile because shared utilities are missing.

| Feature | Purpose | Source file | Logic summary | Remote API | UI usage | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Account transaction feed | Paginated transactions per account | `app/api/accounts/[id]/route.ts` | Validate account id + pagination, call `buildApiUrl("tx","pk")`, forward response | `tx/pk/:accountId` | None | Broken (utilities absent) |
| Block by hash | Retrieve block details | `app/api/blocks/[id]/route.ts` | Validate id, call `buildApiUrl("block","hash")`, forward response | `block/hash/:id` | None | Broken |
| Transaction by hash | Retrieve transaction details | `app/api/transactions/[id]/route.ts` | Validate id, call `buildApiUrl("tx","hash")`, forward response | `tx/hash/:hash` | None | Broken |
| Smart-contract detail | Fetch contract metadata/code | `app/api/contracts/[id]/route.ts` | Validate id, call `buildApiUrl("sc")`, forward response | `sc/:id` | None | Broken |
| Block chart dataset | Provide timestamp-based block stats | `app/api/barchart/[timestamp]/route.ts` | Validate timestamp + pagination, call `buildApiUrl("block","ts")`, forward response | `block/ts/:timestamp` | None | Broken |

Common behaviour:
- Routes export `dynamic = "force-dynamic"` and `revalidate = 0` → always server-side, no caching.
- On HTTP errors they return `{ message: response.statusText, status: response.status }`.
- Catch blocks log the error and respond with HTTP 500.
- Dependencies `@/utils/serverEnv` and `@/utils/validation` are missing, so no route currently compiles.

---

## 3. Partial or Truncated Implementations

### Empty Route Segments
Directories exist for many pages but do not contain `page.tsx`, `layout.tsx`, `loading.tsx`, or `error.tsx`:
`app/accounts/[id]`, `app/blocks/[id]`, `app/contracts/[id]`, `app/transactions/[id]`, `app/developers`, `app/knowledge`, `app/nodes`.

### Empty Component Modules
All folders under `components/` (`Header`, `Footer`, `List/BlockList`, `List/TransactionList`, `blocks`, `transactions`, `chartDasboard`, `StatsDashboard`, `contracts/**`, `pagination`, `LoadingSkeleton`) contain no code. The UI must be designed from scratch.

### Missing Utilities
| Utility | Expected file | Role |
| --- | --- | --- |
| `buildApiUrl` | `@/utils/serverEnv.ts` | Compose remote endpoint from env vars (`API_BASE_URL`, environment selection, etc.). |
| `validateId`, `validatePaginationParams` | `@/utils/validation.ts` | Enforce hash/address/pagination validation and return `{ valid, params, error }`. |

### Planned API Routes Without Code
- `app/api/stats/`
- `app/api/userchart/`

### Global App Structure Missing
- `app/layout.tsx` and `app/page.tsx` do not exist.
- No config files: `package.json`, `tsconfig.json`, `next.config.js`, `.env.example`.

---

## 4. Missing Features Needed for Production

| Feature | Description | Expected Input / Output | UI behaviour | Backend requirements | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| Block list | Display latest blocks with metadata | `GET /api/blocks?page&size&sort` → `{ items: BlockSummary[], page, total }` | Table (#, hash, timestamp, producer, tx count), optional live refresh | Aggregator over indexed DB or RPC with filters/sorting | Loads <1s, working pagination, links to `app/blocks/[id]` |
| Block detail | Full block information + transactions | `GET /api/blocks/:hash` | Summary card (height, gas, difficulty) + transaction tabs + raw JSON | Combine `eth_getBlockByHash` with validator/reward data | Show every transaction, robust 404 handling |
| Transaction list | Global recent transactions feed | `GET /api/transactions?page&filters` | Table (status, value, fee, from/to) with filters | Requires indexed datastore or search service | Filters by address, range, status; CSV export |
| Transaction detail | Receipt + trace view | `GET /api/transactions/:hash` | Overview, logs/events, raw calldata, timeline | RPC `eth_getTransactionReceipt` + optional trace | Pending→mined updates, event decoding, error display |
| Account detail | Balance/activity overview | `GET /api/accounts/:addr` + `/transactions` | Balance card, activity chart, paginated tx table | RPC aggregator + caching, internal tx if available | Accurate balance, ENS/labels, contract indicators |
| Search engine | Global search box | `GET /api/search?q` | Header search with auto-submit | Classify query (block/tx/account) and redirect | Response <500ms, clear errors when not found |
| Stats dashboard | KPI cards & charts | `GET /api/stats`, `GET /api/barchart/:ts`, `GET /api/userchart` | Cards + charts (`components/chartDasboard`, `components/StatsDashboard`) | Batch service with caching (Redis) + optional websocket | Refresh every 60s, fallback data when API down |
| Websocket live updates | Real-time blocks/tx ticker | WS topics `/blocks`, `/transactions` | Banner/ticker for new blocks/tx, auto-update tables | Node gateway listening to RPC streaming provider | Latency <2s, auto-reconnect/backoff |
| Wallet connection | Connect EIP-1193 wallets | Provider inputs | Header button, session state | Client-side integration (wagmi/ethers) | MetaMask + WalletConnect supported, persistent state |
| Error handling & observability | Consistent UX + logging | All requests | Friendly alerts/toasts, fallback pages | Middleware for logging, requestId correlation, rate limiting, Sentry | No stack traces leaked; centralized logs |
| Security layers | Protect against abuse | All public endpoints | Sanitized output, throttled inputs | WAF / rate limit (`app/api/_middleware.ts`), strict validation | OWASP Top 10 compliance, automated scans |

---

## 5. Architecture Overview

### Folder Structure Snapshot
```
app/
  api/
    accounts/[id]/route.ts
    barchart/[timestamp]/route.ts
    blocks/[id]/route.ts
    contracts/[id]/route.ts
    stats/        (empty)
    transactions/[id]/route.ts
    userchart/    (empty)
  accounts/[id]/  (empty)
  blocks/[id]/    (empty)
  contracts/[id]/ (empty)
  developers/     (empty)
  knowledge/      (empty)
  nodes/          (empty)
  transactions/[id]/ (empty)
components/       (empty subfolders)
context/          (empty)
public/           (empty)
styles/           (empty)
utils/            (empty, though referenced)
```

### Framework & Libraries
- Next.js App Router (imports `next/server`), likely v13+.
- TypeScript expected, yet `tsconfig.json` is missing.
- No `package.json`; dependencies must be redefined (React, Next, etc.).

### Routing & Components
- Only API routes exist; no UI pages render today.
- Directory structure anticipates nested routes for blocks/transactions/accounts.
- Component folders suggest domain-specific building blocks (header/footer, block list, transaction list, contract tabs, pagination, loading skeleton).

### API Services
- Each API route proxies to an external Savitri backend by composing URLs via `buildApiUrl`.
- Fetch calls enforce `cache: "no-store"` and no revalidation caching.
- Middleware for logging/rate limiting is not yet present.

### State Management & Environments
- No state layer yet. Once UI exists, adopt Context/Zustand/Redux toolkit for shared filters/preferences.
- `.env.local` must define at least `API_BASE_URL`, `RPC_URL`, `CHAIN_ID`, analytics keys, websocket endpoints, etc. Provide `.env.example`.

### Diagram (text form)
```
graph TD
  UI[Next.js Pages & Components] -->|fetch| APIProxy[Next API Routes]
  APIProxy -->|REST| SavitriBackend[Backend Savitri Explorer]
  SavitriBackend -->|RPC| SavitriNodes[(Savitri RPC Cluster)]
```

---

## 6. Services Currently Used

| Service | Reference | Description | Notes |
| --- | --- | --- | --- |
| Savitri Backend REST API | via `buildApiUrl()` inside every route | Proprietary backend exposing REST endpoints for blocks (`block/hash`, `block/ts`), transactions (`tx/hash`, `tx/pk`), smart contracts (`sc/:id`) | Base URL unknown until `serverEnv` is implemented |
| Next.js API Routes | `app/api/**/route.ts` | Server runtime (Node/serverless) performing proxying and input validation | Needs `package.json` to specify Next version and scripts |
| Built-in fetch | `fetch(url, { cache: "no-store" })` | Sends the outbound HTTP requests | No custom HTTP client in place |

Utility/service contracts implied but absent:
- `@/utils/serverEnv` (base URL factory).
- `@/utils/validation` (input validation).

Minimum frontend dependencies once configured: `react`, `react-dom`, `next`, `typescript`, ESLint + typings.

---

## 7. Referenced but Missing Services

| Placeholder | Expected behaviour | Data contracts | Implementation notes |
| --- | --- | --- | --- |
| `@/utils/serverEnv` → `buildApiUrl(domain, sub?)` | Return the full Savitri backend URL per environment, supporting logical domains (`tx`, `block`, `sc`) and subpaths (`hash`, `pk`, `ts`) | Input e.g. `("tx","hash")` → `https://api.savitri.io/tx/hash`; needs env vars `API_BASE_URL`, `API_TIMEOUT`, optional `API_KEY` | Create `utils/serverEnv.ts`, validate env presence, normalize slashes, throw informative errors |
| `@/utils/validation` → `validateId`, `validatePaginationParams` | Validate hashes/addresses/timestamps + pagination params | `validateId(value: string): boolean`; `validatePaginationParams(...)` → `{ valid, params: { page, size, sort }, error? }` | Build regexes (hash `^0x[a-fA-F0-9]{64}$`, etc.), enforce bounds (page ≥1, size ≤100), add unit tests |
| `app/api/stats/route.ts` | Return KPI metrics (TPS, gas, supply, validators) | `{ tps, avgGas, totalTx24h, supply, validatorsOnline, chart: DataPoint[] }` | Requires backend endpoint or aggregation service + caching |
| `app/api/userchart/route.ts` | Dataset for user-centric charts | `{ labels: string[], values: number[] }` | Similar to `barchart`, tailored per account/user segment |
| UI components (`components/**`) | Render layout, lists, contract tabs, pagination, loaders | Well-typed React components using CSS Modules/Tailwind/etc. | Establish design system, reuse across pages |
| Global layouts/pages (`app/layout.tsx`, `app/page.tsx`, etc.) | Provide shell, metadata, navigable sections per domain | Standard Next App Router conventions with Suspense boundaries and fallback UIs | Include `loading.tsx` / `error.tsx` where appropriate |
| Project configs (`package.json`, `tsconfig.json`, `next.config.js`) | Set up scripts, TypeScript options, build targets | — | Scaffold a new Next app (`npx create-next-app`) and migrate existing routes |
| Monitoring/logging | Structured logging, tracing, alerting | JSON logs `{ requestId, route, duration }`, Sentry/Datadog integration | Add `utils/logger.ts`, central middleware for logging and correlation IDs |

---

## 8. Developer To-Do List

### UI
- **High**: Implement homepage/dashboard (`app/page.tsx`) consuming `/api/stats` + `/api/barchart/...`; ensure <2s load, responsive layout, fallback skeletons.
- **High**: Build block list page (`app/blocks/page.tsx`) and `components/List/BlockList/BlockList.tsx`; support server/client pagination and deep links.
- **High**: Build block detail page (`app/blocks/[id]/page.tsx`) with `components/blocks/BlockSummary.tsx` and `components/transactions/TransactionTable.tsx`; include 404 handling.
- **Medium**: Create global layout (`app/layout.tsx`) plus `components/Header`, `components/Footer`, `components/pagination`.
- **Medium**: Implement transactions list page (`app/transactions/page.tsx`) and `components/List/TransactionList`.
- **Low**: Populate `app/developers`, `app/knowledge`, `app/nodes` with documentation/help content.

### Backend / Utilities
- **High**: Implement `utils/serverEnv.ts` and `utils/validation.ts` with comprehensive unit tests.
- **High**: Create `app/api/stats/route.ts` and `app/api/userchart/route.ts` with configurable caching.
- **Medium**: Add `app/api/_middleware.ts` for logging and rate limiting.
- **Medium**: Normalize error handling/messaging across all routes.

### API Integration
- **High**: Produce an OpenAPI/Swagger contract for Savitri backend (`docs/api-contract.md`).
- **Medium**: Implement a resilient server-side client (`lib/savitriClient.ts`) with retry, timeout, tracing.

### Blockchain Interaction
- **High**: Create RPC fallback service (`services/rpcClient.ts`) to query Savitri nodes when backend fails.
- **Medium**: Implement WebSocket gateway for live blocks/transactions (`app/api/stream` or standalone service).

### Security
- **High**: Sanitize inputs/outputs, add rate limiting, CORS policy, HTTP security headers (`middleware.ts`, `next.config.js`).
- **Medium**: Integrate monitoring/alerting (Sentry) and document controls (`docs/security.md`).

### Testing
- **High**: Configure Jest/Vitest + Testing Library; ensure `npm test` passes in CI.
- **Medium**: Set up Playwright/Cypress e2e tests (search, navigation, transactions) within CI.

### Deployment
- **High**: Add `package.json`, `tsconfig.json`, `next.config.js`, `.eslintrc`, `.env.example`; verify `npm run dev/build`.
- **Medium**: Document deployment pipeline (Vercel/container) in `docs/deployment.md`.

---

## 9. Testing Strategy

### Unit Tests
- `utils/validation.ts`: hash/address validation, pagination defaults (page=1, size=20, sort=desc), bounds (size ≤100), error messages.
- `utils/serverEnv.ts`: correct URL generation across domains/subpaths, throws when `API_BASE_URL` missing, normalizes slashes/query params.
- `app/api/**/route.ts`: ensure invalid IDs yield 400, backend status codes are propagated, fetch failures return 500 (mock `global.fetch`).

### Integration Tests
- API proxy ↔ backend using Jest/Vitest + `msw`: verify JSON passthrough, query parameter construction, error propagation.
- Stats/userchart endpoints once implemented: caching respected, JSON schema validated.

### End-to-End Tests (Playwright/Cypress)
- Global search: hash/address detection, success + “Not found” flows.
- Block navigation: pagination, detail pages, tab visibility.
- Account navigation: charts render, paginated transactions load.
- Dashboard stats: real-time + historical fallback; simulate API downtime.
- Websocket updates: inject mock events, verify UI refresh.

### Blockchain-Specific Scenarios
1. Pending → mined transaction updates automatically.
2. Chain re-org: orphaned blocks flagged, canonical chain refreshed.
3. Smart-contract failures: revert reasons surfaced visibly.
4. High-volume addresses: pagination remains <2s latency.
5. Large log sets (>1000 events): UI supports filtering/condensation.

### Tooling & Automation
- Separate CI jobs for `lint`, `test-unit`, `test-integration`, `test-e2e`.
- Enforce ≥80% coverage on utilities and API routes.
- Snapshot testing for key UI components (e.g., `components/List/BlockList`).

---

## 10. Run, Build & Deploy

> Because `package.json` is absent, initialize a fresh Next.js 13+ project and migrate the existing `app/api` folder into it.

### Setup & Dependencies
1. Install Node.js LTS ≥18.
2. Scaffold the project:
   ```bash
   npx create-next-app@latest savitri-explorer
   ```
3. Copy the current `app/api` directory into the new project.
4. Install dependencies:
   ```bash
   npm install react react-dom next
   npm install -D typescript @types/react @types/node eslint vitest playwright
   ```
5. Create missing configs: `tsconfig.json`, `next.config.js`, `.eslintrc.js`, `.prettierrc`.

### Environment Variables
Provide `.env.local` and `.env.example` with at least:
```
API_BASE_URL=https://api.savitri.io
RPC_URL=https://rpc.savitri.io
CHAIN_ID=12345
NEXT_PUBLIC_WEBSOCKET_URL=wss://ws.savitri.io
SENTRY_DSN=
```
`utils/serverEnv.ts` must load and validate these values.

### Commands
| Command | Description |
| --- | --- |
| `npm run dev` | Start Next dev server (localhost:3000) |
| `npm run lint` | Run ESLint |
| `npm run test` | Execute unit + integration tests |
| `npm run build` | Build production bundle (`.next/`) |
| `npm start` | Serve the production build |

### Deployment
- **Vercel**: connect GitHub repo, set environment variables per environment, auto-deploy `main`.
- **Container / Custom Cloud**: use a Dockerfile similar to:
  ```Dockerfile
  FROM node:18-alpine
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci
  COPY . .
  RUN npm run build
  EXPOSE 3000
  CMD ["npm","start"]
  ```
  Then deploy via Azure Web App, AWS ECS, Kubernetes, etc.

### Observability & Ops
- Integrate Sentry/Datadog via `next.config.js`.
- Expose `/api/health` for load-balancer checks.
- Ensure CI/CD runs lint → tests → build before deploy.

---

## Appendices
- **Repository gaps**: no `package.json`, `tsconfig`, `next.config`, `.env`, UI components, or utility modules.
- **Immediate priorities**: implement utilities, scaffold UI, document backend contracts, and establish tooling/tests before feature expansion.

This consolidated specification should serve as the definitive blueprint for completing Savitri Explorer.

