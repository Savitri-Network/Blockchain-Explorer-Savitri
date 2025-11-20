# Product Requirements Document (PRD)
## Savitri Blockchain Explorer (Testnet)

**Version:** 1.0  
**Date:** 2024  
**Status:** Active Development  
**Repository:** savitri-explorer-main

---

## 1. Executive Summary

The Savitri Blockchain Explorer is a Next.js web application designed to provide comprehensive visibility into the Savitri blockchain testnet. It serves as a public-facing interface for viewing, searching, and analyzing blocks, transactions, accounts, and smart contracts. The application acts as both a user-friendly explorer and a developer debugging tool, positioning itself as a showcase for the Savitri testnet ecosystem.

### 1.1 Product Vision

To create an intuitive, performant, and feature-rich blockchain explorer that enables users to:
- Explore and understand the Savitri testnet activity
- Debug and analyze blockchain data for development purposes
- Monitor network health and statistics
- Interact with smart contracts
- Serve as a public showcase for the Savitri blockchain community

### 1.2 Target Audience

- **Primary Users:**
  - Blockchain developers working on Savitri testnet
  - Early adopters and community members
  - Partners and stakeholders evaluating the network

- **Secondary Users:**
  - General public interested in blockchain technology
  - Researchers and analysts
  - Node operators

---

## 2. Product Overview

### 2.1 Core Purpose

The Savitri Blockchain Explorer is a web application that enables users to:

1. **View and Search** blocks, transactions, accounts, and smart contracts on the Savitri testnet
2. **Monitor Statistics** and visualizations of network activity (TPS, blocks, active users)
3. **Debug and Analyze** blockchain data with developer-focused tools (technical details, logs, transaction codes, QR codes, raw JSON)
4. **Showcase** the testnet as a public-facing platform for the community, partners, and early adopters

### 2.2 Technical Foundation

The application is built with:
- **Framework:** Next.js (App Router) with TypeScript
- **Architecture:** Frontend communicates with external backend API via environment variable `PROMETEO_API_DATA_BASE_URL`
- **API Layer:** Next.js API routes act as proxy layer between frontend and backend data API
- **State Management:** React Context API for wallet integration
- **Data Visualization:** Chart.js for interactive charts and graphs
- **Security:** Security headers configured (HSTS, X-Frame-Options, CSP, etc.)
- **Performance:** Image optimization, compression, console.log removal in production
- **Validation:** Centralized input validation for all API routes
- **Logging:** Structured logging system for error tracking and monitoring

### 2.3 Key Differentiators

- **Unified Search:** Etherscan-style global search supporting blocks, transactions, accounts, and contracts
- **Developer Tools:** Advanced debugging panel with technical details, QR codes, and raw JSON
- **Real-time Statistics:** Live network metrics and visualizations
- **Smart Contract Explorer:** Full contract interaction interface (read/write operations)
- **Wallet Integration:** Browser extension integration for future wallet features

---

## 3. Architecture

### 3.1 Frontend Architecture

#### 3.1.1 Directory Structure

```
app/
├── page.tsx                    # Homepage (Stats + Lists + Charts)
├── blocks/
│   ├── page.tsx               # Block list
│   └── [id]/page.tsx          # Block detail
├── transactions/
│   ├── page.tsx               # Transaction list
│   └── [id]/page.tsx          # Transaction detail
├── accounts/
│   ├── page.tsx               # Account list
│   └── [id]/page.tsx          # Account detail
├── contracts/
│   ├── page.tsx               # Contract list
│   └── [id]/page.tsx          # Contract detail
├── developers/page.tsx         # Coming soon
├── knowledge/page.tsx          # Coming soon
└── nodes/page.tsx              # Coming soon
```

#### 3.1.2 Key Components

**StatsDashboard** (`components/StatsDashboard/StatsDashboard.tsx`)
- Displays global network metrics
- Provides unified search functionality
- Shows statistics cards (total blocks, transactions, accounts, contracts)

**Chart Dashboard** (`components/chartDasboard/`)
- `DashboardCards.tsx` - KPI cards
- `ActiveUsersChart.tsx` - Active users over time
- `BlocksChart.tsx` - Blocks per time interval
- `TransactionChart.tsx` - Transaction volume charts

**List Components** (`components/List/`)
- `List.tsx` - Container for block and transaction lists
- `BlockList.tsx` - Recent blocks display
- `TransactionList.tsx` - Recent transactions display

**Block Components** (`components/blocks/`)
- `BlockList.tsx` - Full block list with filtering and pagination

**Transaction Components** (`components/transactions/`)
- `TransactionLists.tsx` - Transaction list with search and filters

**Contract Components** (`components/contracts/`)
- `ContractCode.tsx` - Contract code viewer
- `ReadCode.tsx` - Read-only contract interactions
- `WriteCode.tsx` - Write contract interactions
- `TransactionListContracts.tsx` - Contract transaction history

**Shared Components**
- `pagination/pagination.tsx` - Pagination controls
- `LoadingSkeleton/LoadingSkeleton.tsx` - Loading states

### 3.2 API Proxy Layer

#### 3.2.1 Architecture Pattern

The frontend does not communicate directly with the blockchain RPC. Instead, it uses Next.js API routes as a proxy layer that interfaces with an external API Gateway (`PROMETEO_API_DATA_BASE_URL`).

#### 3.2.2 API Routes Structure

```
app/api/
├── blocks/
│   ├── route.ts              # GET /api/blocks?page=X&size=Y&sort=Z
│   └── [id]/route.ts         # GET /api/blocks/[id]
├── transactions/
│   ├── route.ts              # GET /api/transactions?page=X&size=Y&sort=Z
│   └── [id]/route.ts         # GET /api/transactions/[id]
├── accounts/
│   ├── route.ts              # GET /api/accounts?page=X&size=Y&sort=Z
│   └── [id]/route.ts         # GET /api/accounts/[id]
├── contracts/
│   ├── route.ts              # GET /api/contracts?page=X&size=Y&sort=Z
│   └── [id]/route.ts         # GET /api/contracts/[id]
├── stats/route.ts            # GET /api/stats
└── barchart/[timestamp]/route.ts  # GET /api/barchart/[timestamp]?page=X&size=Y&sort=Z
```

#### 3.2.3 URL Building Function

**`buildApiUrl(...segments: string[])`** in `utils/serverEnv.ts`

This function constructs URLs to the Savitri data backend:
- Takes the base URL from `PROMETEO_API_DATA_BASE_URL` environment variable
- Joins path segments safely (handles slashes)
- Returns complete API endpoint URLs

**Example Usage:**
```typescript
const BLOCKS_URL = buildApiUrl("blocks");
const LEDGER_URL = buildApiUrl("ledger");
const STATS_URL = buildApiUrl("info");
```

#### 3.2.4 API Route Behavior

Each API route:
1. Receives query parameters (page, size, sort, etc.)
2. **Validates input parameters** using `validatePaginationParams()` or `validateId()` from `utils/validation.ts`
3. Constructs remote URL using `buildApiUrl()`
4. Performs `fetch()` to backend with `cache: "no-store"` for dynamic data
5. Returns JSON response to frontend
6. Handles errors with appropriate status codes and structured error messages
7. Uses `export const dynamic = "force-dynamic"` and `export const revalidate = 0` for real-time data

**Validation Functions:**
- `validatePaginationParams(page, size, sort)` - Validates and sanitizes pagination parameters
  - Defaults: page=1, size=20, sort=1
  - Constraints: size max 100, sort must be 1 or -1
  - Returns `ValidationResult` with validated params or error message
- `validateId(id)` - Validates that ID parameter is non-empty string

### 3.3 Utilities and Context

#### 3.3.1 Utility Functions

**`utils/functions.ts`**

**`timeSince(date: Date)`**
- Converts timestamp to human-readable format ("X minutes ago", "X hours ago")
- Used throughout the application for displaying relative time
- Handles years, months, days, hours, minutes, and seconds

**`getType(txHash: string)`**
- Maps transaction hash prefix to transaction type description
- Uses `transactionTypes` mapping from `utils/types.ts`
- Returns user-friendly transaction type labels
- Handles uppercase conversion of prefix

**`getTypeFromTxHash(tx_hash?: string)`**
- Calculates transaction cost in tokens based on hash prefix
- Uses `costInTokensMapping` from `utils/types.ts`
- Returns cost as string or "-" if not found
- Used in transaction detail pages

**`getDataTypeAndLink(data: DataType | Record<string, unknown>)`**
- Determines if a search result is a block, transaction, account, or contract
- Uses type definitions from `utils/dataTypes.ts`
- Returns `DataTypeResult` with type and link
- Generates appropriate navigation link
- Used in StatsDashboard search functionality

**`utils/validation.ts`**

**`validatePaginationParams(page, size, sort)`**
- Validates and sanitizes pagination query parameters
- Returns `ValidationResult` with validated params or error message
- Defaults: page=1, size=20, sort=1
- Constraints: size max 100, sort must be 1 or -1
- Used by all API routes that accept pagination

**`validateId(id: string | undefined)`**
- Validates that ID parameter is non-empty string
- Used by detail API routes (`[id]/route.ts`)
- Returns boolean

**`utils/dataTypes.ts`**

Type definitions for blockchain data structures:
- `BlockData` - Block data structure
- `TransactionData` - Transaction data structure
- `ContractData` - Smart contract data structure
- `AccountData` - Account data structure
- `DataType` - Union type of all data types
- `DataTypeResult` - Result type for `getDataTypeAndLink()`

**`utils/types.ts`**

**`transactionTypes`**
- Mapping of transaction hash prefixes to human-readable descriptions
- Includes all transaction types (AA00, AA01, AA03, BB00, SC01, etc.)

**`costInTokensMapping`**
- Mapping of transaction hash prefixes to token costs
- Used by `getTypeFromTxHash()` to calculate transaction costs

**`utils/logLevel.ts`**

**`LogLevel` enum**
- Centralized log level definitions: INFO, ERROR, DEBUG, WARN, FATAL, TRACE
- Used by logging system throughout the application

**`utils/logger.ts`**

**`logMessage(level, type, data, userId, source)`**
- Structured logging function
- Sends logs to backend logging API endpoint
- Handles AxiosError objects specially
- Used by wallet context and other components for error tracking

#### 3.3.2 Wallet Context (`context/wallet.tsx`)

React Context for browser wallet extension integration:

**Capabilities:**
- Send connection/signing requests via `window.postMessage`
- Receive messages from Savitri wallet extension
- Manage state (pubkey, errors, lastRequest, popupData, etc.)
- **Structured error logging** using `logMessage()` from `utils/logger.ts`
- **Origin validation** for security (validates message source)

**Message Types Handled:**
- `IKARUS_READY` - Wallet extension ready
- `IKURUS_IS_WORKING` - Wallet is working
- `PK_IS` - Public key received
- `tx` - Transaction response
- `NEW_SUBWALLET` - New subwallet created
- `SK_VALID` - Secret key validated
- `ERROR` - Error occurred (logged with structured logging)

**Security Features:**
- Origin validation for postMessage
- Uses `window.location.origin` for same-origin communication
- Validates message source before processing

**Future Product Integration:**
- "Open in Wallet" functionality
- "Connect Wallet" button
- Direct wallet interactions from explorer
- Transaction signing flows

---

## 4. Features and Functionality

### 4.1 Homepage (`app/page.tsx`)

The homepage renders three main sections:

#### 4.1.1 Stats Dashboard

**Component:** `<StatsDashboard />`

**Features:**
- **Global Metrics Display:**
  - Total blocks
  - Total transactions
  - Total accounts (ledger)
  - Total smart contracts
  - Additional statistics from `/api/stats` endpoint

- **Global Search Bar:**
  - Etherscan-style unified search
  - Accepts:
    - Block height/ID
    - Transaction hash
    - Account address
    - Contract ID
  - Single entry point to all on-chain resources

**Search Implementation:**
- Uses functions from `components/StatsDashboard/api.ts`:
  - `fetchBlocks(query)`
  - `fetchTransactions(query)`
  - `fetchAccounts(query)`
  - `fetchSmartContracts(query)`
  - `fetchAll(query)` (fallback combined search)

- Each function queries respective API routes:
  - `/api/blocks?page=1&size=100&sort=1`
  - `/api/transactions?page=1&size=100&sort=1`
  - `/api/accounts?page=1&size=100&sort=1`
  - `/api/contracts?page=1&size=100&sort=1`

- Client-side filtering by query term
- Uses `getDataTypeAndLink()` to determine result type and generate correct link

**Current Limitation:**
- Downloads `size=100` and filters client-side
- **Future Improvement:** Backend search endpoint with `?search=` parameter

#### 4.1.2 Recent Lists

**Component:** `<List />`

**Structure:**
- Includes `<BlockList />` (latest blocks)
- Includes `<TransactionList />` (latest transactions)

**Data Source:**
- `/api/blocks?page=1&size=N&sort=1`
- `/api/transactions?page=1&size=N&sort=1`

**Display Format:**
- Compact rows showing:
  - Block/transaction ID
  - Time ("timeSince" format)
  - Validator/account
  - Number of transactions in block
  - Other relevant metadata

#### 4.1.3 Chart Dashboard

**Component:** `<ChatDashboard />` (Chart Dashboard)

**Components:**
- `<DashboardCards />` - Main KPI cards
- `<ActiveUsersChart />` - Active users over time (ledger activity)
- `<BlocksChart />` - Blocks per time interval (uses `/api/barchart/[timestamp]`)
- `<TransactionChart />` - Transaction volume bar chart

**Technology:**
- Chart.js for visualization
- Axios for API calls to internal routes
- Internal routes proxy to backend data API

**Product Intent:**
- Visual overview of testnet activity
- User growth trends
- Block production metrics
- Transaction traffic patterns

### 4.2 Blocks Section

#### 4.2.1 Block List (`app/blocks/page.tsx`)

**Component:** `DynamicBlockList` (dynamic import of `components/blocks/BlockList.tsx`)

**Data Structure:**
```typescript
interface BlockItem {
  status: string;
  _id: string;          // Block ID
  timestamp: number;
  signature: string;    // Block hash/signature
  pubkey: string;       // Validator/node
  branch: string[];
  txs: any[];
}
```

**Functionality:**
- **Data Fetching:**
  - Uses `axios.get('/api/blocks?page=...&size=...&sort=1')`
  - Local state: `currentPage`, `rowsPerPage`, `totalPages`, `totalBlocks`

- **Filtering:**
  - Text search: `searchTerm`
  - Dropdown filter: `selectedFilter`
    - All
    - ID
    - Hash
    - Account
  - Client-side filtering with `includes()`

- **Features:**
  - Paginated block table
  - Text filter and dropdown filter
  - Pagination component
  - Time display via `timeSince()`

**User Behavior:**
- Click block ID → navigate to `/blocks/[id]`
- Search by:
  - Block ID
  - Block hash
  - Validator pubkey

#### 4.2.2 Block Detail (`app/blocks/[id]/page.tsx`)

**Data Retrieval:**
- Extracts `params.id`
- Calls `/api/blocks/[id]` with `fetch`

**Display Information:**
- **Block Information:**
  - Block hash
  - Parent hash
  - Timestamp + `timeSince` format
  - Signature
  - Validator/pubkey
  - Number of transactions

- **Transaction List:**
  - Transaction hash
  - Sender/receiver (if present)
  - Amount
  - Link to transaction detail

- **Sharing:**
  - QR Code of page URL (`buildPublicAppUrl`)
  - Easy sharing of block page

**UX Goals:**
- Etherscan-style detail page
- Navigation capabilities:
  - Previous/next block navigation
  - Navigate to each transaction
  - Navigate to involved accounts

### 4.3 Transactions Section

#### 4.3.1 Transaction List (`app/transactions/page.tsx`)

**Component:** `DynamicTransactionList` (imports `components/transactions/TransactionLists.tsx`)

**Data Structure:**
```typescript
interface Transaction {
  tx_hash: string;
  pubkey: string;     // Sender
  receiver: string;
  amount: number;
  timestamp: number;
  status: string;
}
```

**Functionality:**
- **Data Fetching:**
  - Fetch from `/api/transactions?page=...&size=...&sort=1`
  - State: `allTransactions`, `filteredTransactions`, `currentPage`, `rowsPerPage`, `totalPages`

- **Search:**
  - Text search on hash, sender, receiver
  - Client-side filtering

- **Features:**
  - Pagination with `Pagination` component
  - Real-time transaction display
  - Filter by hash or account

**User Behavior:**
- View most recent transactions in real-time
- Filter by transaction hash or account
- Click row to view transaction detail

#### 4.3.2 Transaction Detail (`app/transactions/[id]/page.tsx`)

**Data Retrieval:**
- Extracts `params.id`
- Uses `axios` to call `/api/transactions/[id]`

**Data Structure:**
```typescript
interface TransactionData {
  block_hash: string;
  tx: {
    from: string;
    to: string;
    amount: number;
    fee: number;
    timestamp: number;
    status: string;
    // ... other fields
  };
  events: any[];
  // ... other metadata
}
```

**Display Information:**
- **Transaction Status:** Success/Failed indicator
- **Hash:** Complete transaction hash
- **Block Hash:** Linkable to block detail
- **Parties:** Sender/destination (links to accounts)
- **Value & Fee:** Transaction amount and fees
- **Events:** Transaction logs/events
- **QR Code:** Shareable transaction URL
- **Transaction Type:** From `getType(tx_hash)`
- **Cost in Tokens:** From `getCostInTokens(tx_hash)`

### 4.4 Accounts Section

#### 4.4.1 Account List (`app/accounts/page.tsx`)

**Context:** Uses `WalletContext` (for future wallet interactions)

**Data Source:**
- Calls `/api/accounts?page=...&size=...&sort=1`
- Response is a ledger object:
  - Key = address/pubkey
  - Value = object with `status`, `balance`, `owner`, `last_ts`, etc.

**Functionality:**
- **Search:**
  - `searchTerm` → filters ledger keys client-side
  - Pagination via `Pagination` component
  - Links to details: `/accounts/[pubkey]`

**Product Goal:**
- Quick view of ledger state:
  - Which accounts exist
  - Account balances
  - Last activity timestamp

#### 4.4.2 Account Detail (`app/accounts/[id]/page.tsx`)

**Data Retrieval:**
- Calls `/api/accounts/[pubkey]?sort=1&page=X&size=Y`

**Display Information:**
- **Account Data:**
  - Address/pubkey
  - Balance
  - Owner
  - Last activity (`timeSince` format)
  - QR Code (`buildPublicAppUrl`)

- **Activity:**
  - Paginated table of transactions/activity associated with account
  - Modal for additional information

### 4.5 Smart Contracts Section

#### 4.5.1 Contract List (`app/contracts/page.tsx`)

**Data Source:**
- Fetch from `/api/contracts?sort=1&page=...&size=...`

**Data Mapping:**
```typescript
interface DataRow {
  contractHash: string;         // sc_id
  contractName: string;         // Currently = sc_id
  numberOfCalls: number;        // events.length
  numberOfTransactions: number; // Events with tx_hash
  createdOn: string;            // First event timestamp
  verifiedOn: string | null;    // If event starts with 'SB00'
}
```

**Functionality:**
- Search by hash or name
- Pagination
- Links to contract detail pages

#### 4.5.2 Contract Detail (`app/contracts/[id]/page.tsx`)

**Tab Structure:**

1. **Contract (Overview):**
   - Contract hash
   - Total assets
   - Number of transactions
   - Creator
   - Receiver
   - Creation date
   - Closing conditions

2. **Events:**
   - List of events (ID, time, action)

3. **Code:**
   - `<ContractCode />` - Displays contract code

4. **Read:**
   - `<ReadCode />` - Read-only contract calls

5. **Write:**
   - `<WriteCode />` - Write contract interactions

**Product Intent:**
- Mini "contract explorer" with interface for reading/writing smart contract functions
- Essential for testnet developers
- Full contract interaction capabilities

### 4.6 Placeholder Pages

#### 4.6.1 Developers Page (`app/developers/page.tsx`)

**Current State:** "Coming soon..." placeholder

**Future Concept:**
- Documentation
- SDK links
- GitHub integration
- Developer resources

#### 4.6.2 Knowledge Page (`app/knowledge/page.tsx`)

**Current State:** "Coming soon..." placeholder

**Future Concept:**
- Articles and guides
- Usage tutorials
- FAQ section
- Educational content

#### 4.6.3 Nodes Page (`app/nodes/page.tsx`)

**Current State:** "Coming soon..." placeholder

**Future Concept:**
- Node list
- Guides for running a node
- Node metrics
- Network topology

---

## 5. Technical Requirements

### 5.1 Data Flow

**All data pages (blocks, transactions, accounts, contracts):**
1. Use internal API routes (`app/api/...`)
2. API routes query backend `PROMETEO_API_DATA_BASE_URL`
3. Backend returns data
4. API routes return JSON to frontend
5. Frontend components render data

### 5.2 Pagination

**Implementation:**
- Based on `page` + `size` query parameters to backend
- Backend must return:
  - `items` (list of items)
  - `totalPages` / `total` (or equivalent for local calculation)

**Frontend Handling:**
- Calculates total pages from backend response
- Manages current page state
- Renders pagination controls

### 5.3 Filtering & Search

**Current State:**
- Many searches performed client-side on truncated lists (`size=100`)
- Limited scalability

**Desired State:**
- Delegate to backend as much as possible
- Server-side query filtering
- Backend search endpoint with `?search=` parameter

**Future Improvement:**
- Implement backend search endpoints
- Reduce client-side filtering
- Improve performance for large datasets

### 5.4 Error Handling

**API Routes:**
- Return `NextResponse.json({ message, status })` when upstream fails
- Proper HTTP status codes (400, 404, 500, etc.)
- Structured error messages with error details
- **Input validation** returns 400 with descriptive error messages
- **ID validation** returns 400 for invalid ID parameters
- Error logging to console with context

**Error Response Format:**
```typescript
{
  message: "Error description",
  status: HTTP_STATUS_CODE,
  error?: "Detailed error message"
}
```

**UI:**
- Logs errors to console
- Shows fallback UI (empty list or skeleton)
- **Structured logging** for wallet errors via `logMessage()`
- **Future Improvement:** User-friendly error messages and toast notifications

### 5.5 Time Formatting

**Implementation:**
- `timeSince(date)` used throughout application
- Displays "X minutes ago", "X hours ago" format
- Consistent relative time display

### 5.6 Wallet Integration (Future-Ready)

**Context:** `context/wallet.tsx`

**Capabilities:**
- Receives messages from Savitri wallet browser extension
- Supports:
  - Login requests
  - Signing requests
  - Popup closing
  - Connection management

**Future Product Features:**
- "View in Wallet" button
- "Connect Wallet" functionality
- Direct wallet interactions from explorer
- Transaction signing flows

### 5.7 Environment Configuration

**Required Environment Variables:**
- `PROMETEO_API_DATA_BASE_URL` - Base URL for Savitri data API backend

**Usage:**
- Accessed via `utils/serverEnv.ts`
- Used by `buildApiUrl()` function
- Required at build/runtime
- Validated at startup (throws error if missing)

### 5.8 Security Configuration

**Next.js Security Headers** (`next.config.mjs`):
- `Strict-Transport-Security` - HSTS with max-age 63072000
- `X-Frame-Options: SAMEORIGIN` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `X-XSS-Protection: 1; mode=block` - XSS protection
- `Referrer-Policy: origin-when-cross-origin` - Referrer control
- `X-DNS-Prefetch-Control: on` - DNS prefetching

### 5.9 Performance Optimizations

**Next.js Configuration** (`next.config.mjs`):
- **Image Optimization:** AVIF and WebP formats, multiple device sizes
- **Console Removal:** Removes `console.log` in production (keeps `console.error` and `console.warn`)
- **Compression:** Enabled for all responses
- **React Strict Mode:** Enabled for development
- **Powered-By Header:** Disabled for security

**API Route Configuration:**
- `export const dynamic = "force-dynamic"` - Forces dynamic rendering
- `export const revalidate = 0` - No caching for real-time data
- `cache: "no-store"` in fetch calls - Ensures fresh data

---

## 6. Known Limitations and Improvements

### 6.1 API Routes Uniformity

**Status:** ✅ **RESOLVED**

**Improvements Applied:**
- ✅ All routes now use `GET(req: Request)` with proper typing
- ✅ URL construction standardized using `buildApiUrl()`
- ✅ All routes use `validatePaginationParams()` or `validateId()` for input validation
- ✅ Consistent error handling across all routes
- ✅ Proper TypeScript types for params: `{ params: { id: string } }`
- ✅ All routes use `dynamic = "force-dynamic"` and `revalidate = 0`

**Current State:**
- All API routes follow consistent patterns
- Input validation is centralized and uniform
- Error handling is standardized

### 6.2 Search and Statistics Scalability

**Current Issues:**
- `StatsDashboard/api.ts` always downloads `size=100` and filters client-side
- Not scalable for large datasets

**Recommended Fix:**
- Implement dedicated `/search` endpoint
- Add `search=` parameter to backend
- Move filtering to server-side

### 6.3 Error Handling UI

**Current Issues:**
- UI often only does `console.error`
- No user-facing error messages

**Recommended Fix:**
- Implement error toast/notification system
- Show user-friendly error messages
- Provide retry mechanisms

### 6.4 Placeholder Pages

**Current State:**
- `developers`, `knowledge`, `nodes` are placeholders

**Product Consideration:**
- These should be considered future sections to complete
- Plan content and functionality for each section
- Prioritize based on user needs

---

## 7. User Stories

### 7.1 Explorer User Stories

**As a blockchain explorer user, I want to:**
- Search for a block by height or hash so I can view its details
- Search for a transaction by hash so I can verify its status
- Search for an account by address so I can view its balance and activity
- View network statistics so I can understand overall testnet health
- See visual charts of network activity so I can identify trends
- Navigate from a transaction to its block so I can see block context
- Navigate from a block to its transactions so I can see all transactions in that block
- Share a block/transaction/account page via QR code so I can easily share with others

### 7.2 Developer User Stories

**As a developer, I want to:**
- View detailed transaction information including raw JSON so I can debug issues
- See transaction type and cost so I can understand transaction economics
- View smart contract code so I can understand contract functionality
- Interact with smart contracts (read/write) so I can test my contracts
- View contract events so I can track contract activity
- See transaction logs/events so I can debug smart contract interactions
- Access developer documentation so I can integrate with the network

### 7.3 Community User Stories

**As a community member, I want to:**
- View network statistics so I can see testnet growth
- See active user charts so I can understand adoption
- View recent blocks and transactions so I can stay informed
- Access knowledge base so I can learn about the network
- View node information so I can understand network topology

---

## 8. Success Metrics

### 8.1 Performance Metrics
- Page load time < 2 seconds
- API response time < 500ms
- Search response time < 1 second
- Chart rendering time < 1 second

### 8.2 User Engagement Metrics
- Daily active users
- Search queries per day
- Page views per session
- Time spent on detail pages

### 8.3 Technical Metrics
- API error rate < 1%
- Uptime > 99.5%
- Build success rate 100%
- TypeScript compilation errors: 0

---

## 9. Future Enhancements

### 9.1 Short-Term (1-3 months)
- Complete placeholder pages (Developers, Knowledge, Nodes)
- Implement backend search endpoints
- Improve error handling UI
- Add user-friendly error messages
- Standardize API routes

### 9.2 Medium-Term (3-6 months)
- Wallet extension full integration
- Real-time updates via WebSocket
- Advanced filtering options
- Export functionality (CSV, JSON)
- Mobile-responsive optimizations

### 9.3 Long-Term (6+ months)
- Multi-language support
- Dark mode
- Customizable dashboard
- API rate limiting and caching
- Advanced analytics and reporting
- Integration with additional blockchain tools

---

## 10. Dependencies and Constraints

### 10.1 External Dependencies
- **Backend API:** Requires `PROMETEO_API_DATA_BASE_URL` to be available
- **Wallet Extension:** Future integration requires Savitri wallet browser extension
- **Chart Library:** Chart.js for data visualization

### 10.2 Technical Constraints
- Next.js App Router architecture
- TypeScript type safety requirements
- Server-side rendering limitations
- Browser compatibility requirements

### 10.3 Business Constraints
- Testnet-only functionality (not mainnet)
- Public showcase requirements
- Community and partner visibility needs

---

## 11. Appendix

### 11.1 API Endpoint Reference

**Backend Endpoints (via `PROMETEO_API_DATA_BASE_URL`):**
- `/` - Block list (with query params: page, size, sort)
- `/block/hash/{id}` - Block detail by hash
- `/all_tx` - Transaction list (with query params: page, size, sort)
- `/tx/hash/{id}` - Transaction detail by hash
- `/ledger` - Account list (ledger object)
- `/tx/pk/{pubkey}` - Account transactions (with query params: page, size, sort)
- `/all_sc` - Smart contract list (with query params: page, size, sort)
- `/sc/{id}` - Smart contract detail
- `/info` - Network statistics
- `/block/ts/{timestamp}` - Blocks by timestamp (with query params: page, size, sort)

**Frontend API Routes:**
- `/api/blocks` - Proxy to backend blocks
- `/api/blocks/[id]` - Proxy to backend block detail
- `/api/transactions` - Proxy to backend transactions
- `/api/transactions/[id]` - Proxy to backend transaction detail
- `/api/accounts` - Proxy to backend ledger
- `/api/accounts/[id]` - Proxy to backend account detail
- `/api/contracts` - Proxy to backend contracts
- `/api/contracts/[id]` - Proxy to backend contract detail
- `/api/stats` - Proxy to backend info
- `/api/barchart/[timestamp]` - Proxy to backend block/ts

### 11.2 Component Reference

**Key Components:**
- `StatsDashboard` - Main statistics and search
- `ChartDashboard` - Visual charts and graphs
- `BlockList` - Block listing and filtering
- `TransactionList` - Transaction listing and filtering
- `ContractCode` - Contract code viewer
- `ReadCode` - Read-only contract interactions
- `WriteCode` - Write contract interactions
- `Pagination` - Pagination controls
- `LoadingSkeleton` - Loading states

### 11.3 Utility Functions Reference

**Key Utilities (`utils/functions.ts`):**
- `timeSince(date: Date)` - Format timestamps to relative time
- `getType(txHash: string)` - Get transaction type from hash
- `getTypeFromTxHash(tx_hash?: string)` - Calculate transaction cost in tokens
- `getDataTypeAndLink(data)` - Determine data type and generate link

**Validation Functions (`utils/validation.ts`):**
- `validatePaginationParams(page, size, sort)` - Validate pagination parameters
- `validateId(id)` - Validate ID parameter

**Type Definitions (`utils/dataTypes.ts`):**
- `BlockData`, `TransactionData`, `ContractData`, `AccountData` - Data type interfaces
- `DataType` - Union type
- `DataTypeResult` - Result type for data type detection

**Type Mappings (`utils/types.ts`):**
- `transactionTypes` - Transaction type descriptions
- `costInTokensMapping` - Transaction cost mapping

**Logging (`utils/logger.ts`):**
- `logMessage(level, type, data, userId, source)` - Structured logging

**Log Levels (`utils/logLevel.ts`):**
- `LogLevel` enum - INFO, ERROR, DEBUG, WARN, FATAL, TRACE

**Server Environment (`utils/serverEnv.ts`):**
- `buildApiUrl(...segments)` - Construct backend API URLs
- `API_DATA_BASE_URL` - Base URL constant

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024 | Product Team | Initial PRD creation |
| 1.1 | 2024 | Product Team | Updated with code improvements: validation, security headers, logging, type safety |

---

## 12. Recent Code Improvements

### 12.1 Validation System

**New Files:**
- `utils/validation.ts` - Centralized input validation
  - `validatePaginationParams()` - Validates page, size, sort parameters
  - `validateId()` - Validates ID parameters

**Impact:**
- All API routes now validate input before processing
- Consistent error responses (400 status with descriptive messages)
- Prevents invalid data from reaching backend

### 12.2 Type Safety Improvements

**New Files:**
- `utils/dataTypes.ts` - TypeScript interfaces for blockchain data
- `utils/logLevel.ts` - Centralized LogLevel enum

**Impact:**
- Replaced `any` types with specific interfaces
- Better type safety throughout application
- Improved IDE autocomplete and error detection

### 12.3 Security Enhancements

**Configuration:**
- Security headers in `next.config.mjs`
- Origin validation in wallet context
- Input sanitization via validation functions

**Impact:**
- Protection against common web vulnerabilities
- Secure wallet extension communication
- Validated and sanitized user inputs

### 12.4 Logging System

**New Files:**
- `utils/logger.ts` - Structured logging function
- Integration with wallet context for error tracking

**Impact:**
- Centralized error logging
- Better debugging capabilities
- Structured log format for analysis

### 12.5 Performance Optimizations

**Configuration:**
- Image optimization (AVIF, WebP)
- Console.log removal in production
- Compression enabled
- React Strict Mode

**Impact:**
- Faster page loads
- Smaller bundle sizes
- Better production performance

---

**Document Status:** Active  
**Last Updated:** 2024  
**Next Review:** TBD

