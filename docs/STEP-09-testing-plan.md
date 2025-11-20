## Step 9 · Testing Strategy

### Unit Tests
| Scope | Files / Modules | Scenari |
| --- | --- | --- |
| Validation helpers | `utils/validation.ts` | - `validateId` accetta hash validi e rifiuta stringhe brevi/lunghe<br>- `validatePaginationParams` gestisce default (page=1, size=20, sort=desc) e limiti (size max 100)<br>- Messaggi di errore coerenti |
| Server env builder | `utils/serverEnv.ts` | - Restituisce URL corretti per ogni dominio/sottodominio<br>- Lancia errore se `API_BASE_URL` mancante<br>- Normalizza slash e query |
| API handlers (lightweight) | `app/api/**/route.ts` | - Risposta 400 per ID non valido<br>- Propagazione status code dal backend<br>- Gestione errori (500) se fetch fallisce (mock `global.fetch`) |

### Integration Tests
| Obiettivo | Setup | Scenari |
| --- | --- | --- |
| Proxy API ↔ backend | Test runner (Jest/Vitest) + `msw` per simulare backend | - Richieste con parametri validi ricevono JSON atteso<br>- Errori backend (es. 404) vengono restituiti identici<br>- Parametri di query generati correttamente (page/size/sort) |
| Stats endpoints | Una volta implementati `app/api/stats` e `userchart` | - Caching rispettato<br>- JSON schema valido |

### End-to-End Tests (Playwright/Cypress)
| Scenario | Dettagli |
| --- | --- |
| Ricerca globale | Inserire hash blocco/tx/indirizzo → verificare redirect corretto o messaggio “Not found” |
| Navigazione blocchi | Aprire `/blocks`, cambiare pagina, aprire un blocco e verificare presenza tab transazioni |
| Navigazione account | Aprire `/accounts/:id`, verificare grafici, tab transazioni con paginazione |
| Dashboard stats | Assicurare che i grafici carichino sia dati real-time che storici; simulare API down per verificare fallback |
| Websocket updates | Simulare arrivo nuovo blocco/tx e verificare update UI (richiede mock server WS) |

### Blockchain-specific Scenarios
1. **Transazione pending → mined**: la pagina transazione deve mostrare stato “Pending” e aggiornarsi automaticamente a “Success/Failed”.
2. **Blocchi riorganizzati**: se avviene un fork, i blocchi orfani devono essere marcati correttamente e la UI deve aggiornare la catena canonica.
3. **Contratti che falliscono**: log degli errori (es. revert reason) devono essere mostrati chiaramente.
4. **Grandi volumi**: indirizzi con migliaia di transazioni devono mantenere performance accettabili (<2s per cambio pagina).
5. **Eventi complessi**: transazioni con >1000 log devono poter essere filtrate/compresse visivamente.

### Tooling & Automation
- Integrare test nel CI (GitHub Actions o pipeline dedicata) con job separati: `lint`, `test-unit`, `test-integration`, `test-e2e`.
- Utilizzare coverage threshold (≥80% per utils e API).
- Snapshot testing per componenti UI critici (`components/List/BlockList`).

