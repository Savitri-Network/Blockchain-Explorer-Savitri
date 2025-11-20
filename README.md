# Savitri Blockchain Explorer

## Overview

Savitri Blockchain Explorer is a web application designed to display data from the Savitri blockchain using the API available at https://masternode-test.ikarusway.com/docs#/. This explorer provides detailed insights into accounts, blocks, contracts, transactions, and other relevant blockchain data.

**Website:** [Savitri blockchain explorer](https://explorer.savitrifoundation.tech/)

**Design:** [Figma Design](https://www.figma.com/design/HHe9b6u43S5NoGeDXhXN4e/Savitri-web?node-id=1-1959&t=m9OdYHzenoyR1A98-0)

## Features

- View and search for wallets, blocks, transactions, and contracts.
- Interactive charts and statistics.
- Responsive and user-friendly interface.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

## Installation

### Clone the Repository Using a Token

To clone the repository with HTTPS using a token, you can use any of the following tokens:

- [Personal access tokens](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html)
- [Deploy tokens](https://docs.gitlab.com/ee/user/project/deploy_tokens/index.html)
- [Project access tokens](https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html)
- [Group access tokens](https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html)

### Example:

1. **Clone the repository:**
```
git clone https://<username>:<token>@github.com/yourusername/savitri-blockchain-explorer.git
```
2. **Navigate to the project directory:**
```
cd savitri-blockchain-explorer
```
3. **Install dependencies:**
  ```
  npm install
  # or
  yarn install
  ```

### Running the Project:
To start the development server, run:
```
npm run dev
# or
yarn dev
```

**Open** http://localhost:3000 with your **browser** to see the result.

## Project structure

**The project follows the structure below:**

```
.
├── app
│   ├── accounts
│   │   ├── [id]
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── api
│   │   ├── accounts
│   │   │   ├── [id]
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   ├── barchart
│   │   │   └── [timestamp]
│   │   │       └── route.ts
│   │   ├── blocks
│   │   │   ├── [id]
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   ├── contracts
│   │   │   ├── [id]
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   ├── serverUrRL.tsx
│   │   ├── stats
│   │   │   └── route.ts
│   │   ├── transactions
│   │   │   ├── [id]
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   └── userchart
│   │       └── route.ts
│   ├── blocks
│   │   ├── [id]
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── contracts
│   │   ├── [id]
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── developers
│   │   └── page.tsx
│   ├── favicon.ico
│   ├── knowledge
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── nodes
│   │   └── page.tsx
│   ├── not-found.tsx
│   ├── page.tsx
│   └── transactions
│       ├── [id]
│       │   └── page.tsx
│       └── page.tsx
├── components
│   ├── blocks
│   │   └── BlockList.tsx
│   ├── chartDasboard
│   │   ├── ActiveUserChar.tsx
│   │   ├── BlockBarChart.tsx
│   │   ├── CardDashboard.tsx
│   │   ├── index.tsx
│   │   └── TrabsactionBarChart.tsx
│   ├── contracts
│   │   ├── code
│   │   │   └── ContractCode.tsx
│   │   ├── readcode
│   │   │   └── ReadCode.tsx
│   │   ├── transactions
│   │   │   └── TransactionListContracts.tsx
│   │   └── writecode
│   │       └── WriteCode.tsx
│   ├── Footer
│   │   └── Footer.tsx
│   ├── Header
│   │   └── Header.tsx
│   ├── List
│   │   ├── BlockList
│   │   │   └── BLockList.tsx
│   │   ├── List.tsx
│   │   └── TransactionList
│   │       └── TransactionList.tsx
│   ├── LoadingSkeleton
│   │   └── LoadingSkeleton.tsx
│   ├── pagination
│   │   └── pagination.tsx
│   ├── StatsDashboard
│   │   ├── api.ts
│   │   └── StatsDashboard.tsx
│   └── transactions
│       └── TransactionLists.tsx
├── context
│   └── wallet.tsx
├── Dockerfile
├── next.config.mjs
├── package.json
├── package-lock.json
├── public
│   ├── ikarus_explore_logo.svg
│   ├── logo_savitri.svg
│   ├── vercel.svg
├── README.md
├── styles
│   ├── global.scss
│   ├── Header.module.scss
│   ├── Pagination.module.scss
├── tsconfig.json
└── utils
    ├── functions.ts
    ├── logger.ts
    └── types.ts
```

## Usage
### Project Structure Overview
- `app:` Contains the main application pages and API routes.
- `components:` Reusable UI components.
- `context:` Context providers for state management.
- `public:` Public assets such as images and icons.
- `styles:` SCSS module files for styling components.
-  `utils:` Utility functions and types.
- `Dockerfile:` Configuration file for Docker.
- `next.config.mjs:` Next.js configuration file.

### Key Components
- `app/accounts:` Pages related to accounts.
- `app/api:` API routes for different entities such as accounts, blocks, contracts, etc.
- `components:` Reusable UI components including charts, lists, and dashboards.

### API Folder Explanation

The api folder contains the API routes for the project. Each route is defined in a route.ts file within the relevant directory. These routes handle HTTP requests and interact with the Savitri blockchain API to fetch and manipulate data.

**Example:** `app/api/blocks/route.ts`
This file defines the API route for fetching block data.
```typescript
import { NextResponse } from "next/server";

const BLOCK_URL = `https://masternode-test.ikarusway.com/data/`;

export const GET = async (req: Request, res: Response) => {
  const { searchParams } = new URL(req.url);
  const currentPage = searchParams.get('page');
  const rowsPerPage = searchParams.get('size');
  const sort = searchParams.get('sort');

  const queryParams = `?page=${currentPage}&size=${rowsPerPage}&sort=${sort}`;
  const url = `${BLOCK_URL}${queryParams}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json({ message: response.statusText, status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
};
```
This route handles GET requests to fetch block data from the Savitri blockchain API. It extracts query parameters from the request URL, constructs the API request URL, and fetches the data. If successful, it returns the data as a JSON response. If there's an error, it returns an error message with a status code.

***For more information on route handlers in Next.js, you can check the official documentation*** [here](https://nextjs.org/docs/app/building-your-application/routing/route-handlers).



**Example Usage:** `app/blocks/page.tsx`
This file demonstrates how to request data from the above API endpoint.
```javascript
useEffect(() => {
  setLoading(true); // Start loading
  fetch(`/api/blocks?page=${currentPage}&size=${rowsPerPage}&sort=1`)
    .then(response => response.json())
    .then(data => {
      setBlocks(data.items);
      setFilteredBlocks(data.items);
      setTotalPages(Math.ceil(data.totalItems / rowsPerPage));
      setTotal(data.total);
    })
    .catch(error => {
      console.error(error);
    })
    .finally(() => {
      setLoading(false); // Stop loading regardless of the outcome
    });
}, [currentPage, rowsPerPage]);
```
This code snippet from a React component demonstrates how to fetch block data from the API endpoint defined earlier. It uses the useEffect hook to make the API request when the component mounts

## License
This project is licensed under the MIT License.









