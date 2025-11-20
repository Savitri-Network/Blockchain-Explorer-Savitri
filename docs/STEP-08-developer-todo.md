## Step 8 · Developer To-Do List

Le attività sono raggruppate per area, con priorità (High/Medium/Low), file da toccare, output atteso e criteri di accettazione.

### UI
- **High** · Implementare homepage/dashboard (`app/page.tsx`) con cards statistiche e liste sintetiche · Output: pagina SSR che chiama `/api/stats` e `/api/barchart/...` · AC: caricamento < 2s, layout responsive, fallback `LoadingSkeleton`.
- **High** · Creare pagina lista blocchi (`app/blocks/page.tsx`) e componente `components/List/BlockList/BlockList.tsx` · AC: paginazione client/server funzionante, link a dettaglio.
- **High** · Create pagina dettaglio blocco (`app/blocks/[id]/page.tsx`) e componenti `components/blocks/BlockSummary.tsx`, `components/transactions/TransactionTable.tsx` · AC: mostra tutte le info e transazioni del blocco, gestione errori 404.
- **Medium** · Costruire layout globale (`app/layout.tsx`) + `components/Header`, `components/Footer`, `components/pagination` · AC: header con search box e nav, footer con info rete, paginatore riusabile.
- **Medium** · Realizzare pagina transazioni (`app/transactions/page.tsx`) e componente `components/List/TransactionList` · AC: filtri multipli, indicatori di stato.
- **Low** · Implementare sezioni `app/developers`, `app/knowledge`, `app/nodes` con contenuti informativi/documentazione.

### Backend (Next API / Utilities)
- **High** · Creare `utils/serverEnv.ts` e `utils/validation.ts` con test unitari (`__tests__/utils/*.test.ts`) · AC: tutte le API route compilano e respingono input invalidi.
- **High** · Implementare `app/api/stats/route.ts` e `app/api/userchart/route.ts` con caching configurabile · AC: risposta JSON valida, test di integrazione con backend mock.
- **Medium** · Introdurre middleware `app/api/_middleware.ts` per logging e rate limiting · AC: ogni richiesta loggata con `requestId`, rejection su abuso.
- **Medium** · Aggiungere gestione errori consistente (mappa status code → messaggi) in tutte le route.

### API Integration
- **High** · Definire contratto OpenAPI/Swagger per il backend Savitri e documentarlo in `docs/api-contract.md` · AC: endpoint descritti, parametri tipizzati, esempi.
- **Medium** · Implementare client lato server (`lib/savitriClient.ts`) con retry, timeout, tracing.

### Blockchain Interaction
- **High** · Creare servizio RPC fallback (`services/rpcClient.ts`) per interrogare direttamente i nodi Savitri nel caso il backend non risponda · AC: health check, retry esponenziale.
- **Medium** · Implementare websocket gateway per nuovi blocchi/tx, esposto come `app/api/stream` o server standalone.

### Security
- **High** · Sanitizzare input e output, introdurre rate limiting, CORS policy, HTTP security headers · File: `middleware.ts`, `next.config.js` · AC: superare checklist OWASP top 10.
- **Medium** · Integrare monitoring/alerting (es. Sentry) e redigere `docs/security.md`.

### Testing
- **High** · Configurare Jest/Vitest + Testing Library per unit test (utils, componenti) · File: `package.json`, `jest.config.js` · AC: `npm test` verde nel CI.
- **Medium** · Setup Playwright/Cypress per e2e (ricerca, navigazione blocchi, transazioni) · AC: pipeline CI esegue test su build prod.

### Deployment
- **High** · Creare `package.json`, `tsconfig.json`, `next.config.js`, `.eslintrc`, `.env.example` · AC: `npm run dev` e `npm run build` funzionano localmente e nel CI.
- **Medium** · Documentare pipeline (Vercel, Azure o container) in `docs/deployment.md` con strategie per vari ambienti.

