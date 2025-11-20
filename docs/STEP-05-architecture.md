## Step 5 · Architecture Analysis

### Folder Structure (current snapshot)
```
app/
  api/
    accounts/[id]/route.ts
    barchart/[timestamp]/route.ts
    blocks/[id]/route.ts
    contracts/[id]/route.ts
    stats/        (vuoto)
    transactions/[id]/route.ts
    userchart/    (vuoto)
  accounts/[id]/  (vuoto)
  blocks/[id]/    (vuoto)
  contracts/[id]/ (vuoto)
  developers/     (vuoto)
  knowledge/      (vuoto)
  nodes/          (vuoto)
  transactions/[id]/ (vuoto)
components/       (solo directory vuote)
context/          (vuoto)
public/           (vuoto)
styles/           (vuoto)
utils/            (vuoto, ma referenziato dalle API)
```

### Framework & Libraries
- **Next.js App Router** (import `next/server` nelle route). Versione esatta ignota per assenza `package.json`, ma la sintassi suggerisce Next 13+.
- **TypeScript** previsto (estensione `.ts`). Non esistono configurazioni `tsconfig.json`, quindi alcuni default andranno definiti.
- Nessun altro pacchetto è visibile.

### Routing Strategy
- Solo API routes dinamiche nel sottopercorso `app/api/*`.
- Mancano tutte le pagine (`app/page.tsx`, `[segment]/page.tsx`), quindi non c’è rendering lato client/server.
- Prevista struttura nested per dettagli blocchi/tx/account (`app/blocks/[id]`, ecc.) ma non implementata.

### Component Strategy
- Directory `components/` contiene sezioni tematiche (`Header`, `Footer`, `List`, `blocks`, `contracts`, ecc.), segno di un design modulare con responsabilità per dominio.
- Presenza di sottocartelle `contracts/{code,readcode,transactions,writecode}` implica un’idea di tabbed interface per la pagina contratto.
- Necessario definire atomic design, naming convention e dependency graph (es. `components/List/BlockList` riusata da `app/blocks/page.tsx`).

### API Services
- Tutte le route fungono da proxy a un backend Savitri. La funzione `buildApiUrl` (da `@/utils/serverEnv`) dovrebbe comporre un base URL a partire da variabili d’ambiente, consentendo di cambiare ambiente (dev/stage/prod).
- Ogni route forza `cache: "no-store"` e `dynamic = "force-dynamic"`, quindi agisce come pass-through senza caching.
- Da implementare middleware per logging/rate limiting in `app/api/_middleware.ts`.

### State Management
- Non presente. Una volta introdotta la UI, destinare uno store (React Context, Zustand, Redux Toolkit) per preferenze utente (tema, lingua, filtri) e possibili dati condivisi (search history).

### Environment Requirements
- Necessario file `.env.local` con almeno:
  - `NEXT_PUBLIC_API_BASE` o simile (usato da `buildApiUrl`)
  - `RPC_URL`, `CHAIN_ID` se la UI dovrà connettersi direttamente al nodo.
  - Variabili per analytics/logging (es. `NEXT_PUBLIC_SENTRY_DSN`).
- Fornire `.env.example` per chiarire i parametri.

### Suggested Diagram
```
graph TD
  UI[Next.js Pages & Components] -->|fetch| APIProxy[Next API Routes]
  APIProxy -->|REST| SavitriBackend[Backend Savitri Explorer]
  SavitriBackend -->|RPC| SavitriNodes[(Savitri RPC Cluster)]
```

