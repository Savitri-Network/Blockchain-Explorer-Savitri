## Step 6 · Services Currently Used

| Service | Location / Reference | Description | Notes |
| --- | --- | --- | --- |
| Savitri Backend REST API | Referenziato via `buildApiUrl()` in tutte le route `app/api/**/route.ts` | Backend proprietario che espone endpoint REST per blocchi (`block/hash`, `block/ts`), transazioni (`tx/hash`, `tx/pk`), smart contract (`sc/:id`). Probabilmente funge da layer di indicizzazione sopra i nodi Savitri | Il repository non contiene credenziali o configurazioni; senza `serverEnv` la base URL non è nota |
| Next.js API Routes | `app/api/...` | Runtime server-side (Node, Edge o serverless) usato come proxy e punto di validazione parametri. Ogni route disattiva la cache (`no-store`) | Necessita di `package.json` per definire versione Next, scripts, dependencies |
| Node fetch (built-in) | `fetch(url, { cache: "no-store" })` all’interno delle route | Utilizzato per inoltrare richieste al backend Savitri | Non sono usati client HTTP personalizzati |

### Utility / Service Contracts da creare
Sebbene non ancora implementati, i seguenti servizi sono implicitamente richiesti:
- `@/utils/serverEnv`: factory per ottenere base URL (es. `const endpoints = { tx: { pk: "/tx/pk", hash: "/tx/hash" } }` }).
- `@/utils/validation`: modulo di validazione input con supporto a ID (hash blocco/tx), indirizzi, parametri di paginazione e ordinamento.

### Frontend dependencies attese
Dato l’uso di Next App Router, si prevedono come minime:
- `react`, `react-dom`
- `next` (13+)
- `typescript`
- `eslint`, `@types/node`, `@types/react` ecc.
Attualmente nessun file di configurazione è presente, quindi dovranno essere creati ex-novo.

