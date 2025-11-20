## Step 1 · Purpose Of Savitri Explorer

### Mission
Savitri Explorer is intended to become the canonical block explorer for the Savitri network, a proprietary (likely layer-1) blockchain. Its mission is to deliver operational transparency, trustworthy transaction auditing, and high-quality tooling for smart-contract engineers. The product must consolidate insight across blocks, transactions, accounts, and smart-contract executions so that every ecosystem stakeholder can trust the data source.

### Target Users
- **Validators and node operators**: monitor finality, block producers, synchronization, and node health.
- **Smart-contract developers**: inspect logs, events, bytecode, and execution traces for their dApps.
- **Power users and retail users**: search transactions, check account balances, review gas usage and fees.
- **Compliance / audit teams**: perform cross-checks on large on-chain datasets for reporting and investigations.

### Usage Scenarios
1. **Transaction verification** – a user pastes a transaction hash to confirm status, fees, and events.
2. **Block monitoring** – a validator inspects the most recent block and throughput charts.
3. **Smart-contract debugging** – a developer drills into emitted events, bytecode, and ABI-decoded logs.
4. **Account analytics** – an analyst retrieves a paginated feed of every transfer involving an address.

### Blockchain Connectivity
All currently available server-side routes (`app/api/...`) act as proxy layers toward a proprietary Savitri backend, composed via the missing helper `buildApiUrl()` inside `@/utils/serverEnv`. The logical domains exposed so far are:
- `tx/pk` → account-scope transaction listings
- `tx/hash` → transaction detail by hash
- `block/hash` → block detail by hash or height
- `block/ts` → block aggregations grouped by timestamp
- `sc/:id` → smart-contract detail

