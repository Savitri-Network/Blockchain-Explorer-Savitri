## Step 10 · Run, Build & Deploy Instructions

> Poiché il repository non include `package.json`, le istruzioni seguenti assumono che verrà inizializzato un progetto Next.js 13+ e che i file esistenti vengano copiati nella struttura `app/`.

### 1. Setup & Dependencies
1. Installare Node.js LTS ≥ 18.
2. Inizializzare il progetto:
   ```bash
   npx create-next-app@latest savitri-explorer
   ```
3. Copiare la cartella `app/api` dal repository corrente nel nuovo progetto.
4. Aggiungere dipendenze necessarie:
   ```bash
   npm install --save react react-dom next
   npm install --save-dev typescript @types/react @types/node eslint vitest playwright
   ```
5. Creare/configurare i file mancanti: `tsconfig.json`, `next.config.js`, `.eslintrc.js`, `.prettierrc`.

### 2. Variabili d’Ambiente
Creare `.env.local` (non committare) e `.env.example` con almeno:
```
API_BASE_URL=https://api.savitri.io
RPC_URL=https://rpc.savitri.io
CHAIN_ID=12345
NEXT_PUBLIC_WEBSOCKET_URL=wss://ws.savitri.io
SENTRY_DSN=
```
`utils/serverEnv.ts` dovrà leggere `API_BASE_URL` e validarla all’avvio.

### 3. Run & Build
| Comando | Descrizione |
| --- | --- |
| `npm run dev` | Avvia dev server Next (default `http://localhost:3000`) |
| `npm run lint` | Esegue ESLint sul codice |
| `npm run test` | Lancia suite unit/integration (Jest/Vitest) |
| `npm run build` | Produce build di produzione (`.next/`) |
| `npm start` | Esegue server Next sulla build prod |

### 4. Deployment
**Opzione Vercel**
1. Collegare il repository GitHub a Vercel.
2. Configurare variabili ambiente per ogni Environment (Preview/Production).
3. Abilitare deployment automatico su `main`.

**Opzione Container / Cloud custom**
1. Creare `Dockerfile`:
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
2. Utilizzare orchestratore (Azure Web App, AWS ECS, Kubernetes).

### 5. Observability & Ops
- Integrare monitoraggio (Sentry, Datadog) via `next.config.js`.
- Configurare health-check endpoint (es. `/api/health`) per i load balancer.
- Assicurarsi che le pipeline CI/CD includano lint/test/build prima del deploy.

