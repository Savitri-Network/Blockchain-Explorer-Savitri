## Step 2 · Implemented Features (API Layer Only)

> The repository currently ships only a handful of Next.js App Router API routes. No UI exists, therefore every feature below acts purely as a proxy toward the external Savitri backend.

| Feature | Purpose | Source file | Logic (high level) | External / internal APIs | UI components | Working status |
| --- | --- | --- | --- | --- | --- | --- |
| Account transaction feed | Retrieve transactions tied to a given account with pagination and sorting | `app/api/accounts/[id]/route.ts` | 1. Read `id` from dynamic params<br>2. Validate it via `validateId()` (missing)<br>3. Parse `page`, `size`, `sort` query params and validate through `validatePaginationParams()`<br>4. Build remote URL via `buildApiUrl("tx","pk")` and append query string<br>5. `fetch` without cache<br>6. Return JSON or propagate backend error | Savitri backend `tx/pk/:accountId` | None (UI missing) | Broken until `@/utils/serverEnv` & `@/utils/validation` exist |
| Block by hash | Provide block details by hash/height | `app/api/blocks/[id]/route.ts` | Same pattern: validate id → compose URL `buildApiUrl("block","hash")` → fetch → forward response | Backend `block/hash/:id` | None | Broken (missing utilities) |
| Transaction by hash | Fetch detailed transaction info | `app/api/transactions/[id]/route.ts` | Validate id → use `buildApiUrl("tx","hash")` → fetch → return JSON | Backend `tx/hash/:hash` | None | Broken |
| Smart-contract detail | Retrieve metadata and code for a contract | `app/api/contracts/[id]/route.ts` | Validate id → call `buildApiUrl("sc")` → fetch pass-through | Backend `sc/:id` | None | Broken |
| Block chart data (timestamp) | Provide dataset for a bar chart (throughput or block production) | `app/api/barchart/[timestamp]/route.ts` | Validate `timestamp` (reuses `validateId`) → validate pagination → call `buildApiUrl("block","ts")` with query params → return JSON | Backend `block/ts/:timestamp` | None | Broken |

### Common behaviour across routes
- Every handler exports `dynamic = "force-dynamic"` and `revalidate = 0`, hence they always run server-side per request.
- Error path: when `!response.ok`, return `NextResponse.json({ message: response.statusText, status: response.status })`.
- Catch block: log error on the server console and reply with `{ status: 500, message: "Error fetching ..." }`.
- All handlers depend on helper modules (`@/utils/serverEnv`, `@/utils/validation`) that are absent from the repository.

