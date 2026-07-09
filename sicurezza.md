# Checklist sicurezza webapp — da riusare per ogni nuovo progetto

Basata sull'audit fatto su Unicorn Finance (Next.js + Supabase + Vercel, luglio 2026). Due parti: (1) checklist da eseguire, (2) blocco da incollare in `CLAUDE.md`/`AGENTS.md` **all'inizio** del progetto, non alla fine.

---

## Parte 1 — Checklist da eseguire (in ordine)

### 1. Segreti
- [ ] Verifica che `.gitignore` copra `.env*.local`, `.env`, credenziali di terze parti (es. `client_secret_*.json` per OAuth Google) **prima** di scaricare/incollare qualsiasi credenziale nella cartella del progetto.
- [ ] Solo le chiavi esplicitamente "pubbliche" (es. `NEXT_PUBLIC_*`, anon/publishable key protette da RLS) vanno esposte al client. Chiavi service-role, API key di terze parti: mai con prefisso pubblico, mai nel codice client.
- [ ] `git log --all -p -- '*.env*' '*secret*' '*key*'` prima di considerare un repo "pulito" — non basta che ora sia ignorato, controlla che non sia mai stato committato in passato.

### 2. Database / RLS
- [ ] Row Level Security attiva su ogni tabella con dati utente, policy `auth.uid() = user_id` (o equivalente) su ogni operazione (select/insert/update/delete).
- [ ] Usa l'advisor di sicurezza del provider (Supabase: `get_advisors type=security`) — deve tornare vuoto prima di considerare il DB pronto.
- [ ] Usa anche l'advisor performance: indici mancanti sulle foreign key, policy che rivalutano `auth.<function>()` per riga invece che una volta per query (`(select auth.uid())` invece di `auth.uid()`).

### 3. Autenticazione e sessione
- [ ] Ogni operazione che scrive dati deve verificare l'utente autenticato come prima istruzione, prima di qualsiasi lettura/scrittura.
- [ ] Mai creare il client del database a livello di modulo/variabile condivisa tra richieste (rischio leak di sessione su piattaforme serverless con istanze "calde" riutilizzate, es. Vercel Fluid compute).
- [ ] Se il framework fa refresh automatico dei cookie di sessione (Supabase/Auth.js/altri): verifica che le risposte che impostano `Set-Cookie` abbiano `Cache-Control: private, no-store`, altrimenti una CDN/cache condivisa può consegnare la sessione di un utente a un altro.
- [ ] Non abilitare cache/ISR su route che fanno refresh di sessione.
- [ ] Se vuoi forzare un re-login periodico (time-box della sessione) verifica prima se il piano gratuito del provider lo permette — su Supabase, ad esempio, è una funzione bloccata dietro il piano Pro. Non simularlo lato client (es. far scadere un cookie locale mentre il token lato server resta valido): non è una vera misura di sicurezza, un token rubato funzionerebbe comunque.

### 4. Autorizzazione
- [ ] Mai fidarsi di un valore calcolato lato client per decisioni di sicurezza (saldo, permessi, ruolo) — ricalcolare sempre lato server prima di agire.
- [ ] Controllo permessi lato server anche se sembra ridondante rispetto a RLS/policy del DB — è difesa in profondità, non duplicazione inutile.

### 5. Webhook (se presenti)
- [ ] Ogni endpoint webhook verifica la firma della richiesta (HMAC/header specifico del provider) prima di processare qualsiasi payload. Un URL "segreto" non è autenticazione.

### 6. Gestione errori
- [ ] Nessuna Server Action / endpoint API restituisce `error.message` grezzo del database al client — logga il dettaglio solo server-side, restituisci un messaggio generico.
- [ ] Pagine di errore: mai testo libero passato via query string mostrato direttamente all'utente — mappa sempre da un codice fisso a un messaggio prestabilito.
- [ ] Nessun `console.log` di debug lasciato nel codice prima del deploy. `console.error`/logger dedicato per errori reali, mai visibile al client.

### 7. Redirect
- [ ] Qualsiasi redirect che dipende da un parametro controllato dall'utente (query string tipo `?next=`, `?redirect=`) va validato: solo path relativi dello stesso sito, mai URL assoluti — altrimenti è un open redirect sfruttabile per phishing.

### 8. Header HTTP e CORS
- [ ] `Content-Security-Policy`, `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` presenti su tutte le risposte.
- [ ] `Access-Control-Allow-Origin` mai `*` — restringi al dominio del sito (a meno che l'endpoint non sia deliberatamente una API pubblica).
- [ ] Se usi CSP con nonce: verifica compatibilità con qualsiasi cache/rendering statico del framework **prima** di implementarlo — può rompere la build o creare mismatch nonce/cache (successo con Next.js PPR: nonce statico in HTML cachato ≠ nonce fresco nell'header, script bloccato). Se il framework usa rendering statico estensivo, valuta se vale il costo prestazionale.

### 9. Rate limiting
- [ ] Almeno un rate limit di base (anche solo in-memory per IP) sulle route di autenticazione e sulle mutazioni, per rallentare abusi/scripting. Non serve un servizio esterno a pagamento per iniziare — meglio di niente.

### 10. Dipendenze
- [ ] `npm audit` (o equivalente) prima del deploy.
- [ ] Mai `npm audit fix --force` alla cieca — controlla sempre cosa propone di installare/downgradare. Una vulnerabilità minore in una dipendenza transitiva del toolchain di build non giustifica un downgrade breaking del framework principale.

---

## Parte 2 — Blocco da incollare in CLAUDE.md/AGENTS.md a inizio progetto

```markdown
## Regole di sicurezza (non negoziabili)

- Ogni Server Action/endpoint che scrive dati verifica l'utente autenticato come prima istruzione.
- RLS (o equivalente a livello DB) attiva su ogni tabella con dati utente, nessuna eccezione.
- Mai fidarsi di valori calcolati lato client per decisioni di sicurezza — ricalcolare sempre server-side.
- Mai restituire error.message grezzo del database al client — log dettagliato solo server-side, messaggio generico all'utente.
- Nessun console.log di debug nel codice — solo logging di errori reali, mai visibile al client.
- Qualsiasi redirect con parametro controllato dall'utente va validato (solo path relativi, mai URL assoluti).
- Access-Control-Allow-Origin mai wildcard "*".
- Header di sicurezza (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) su tutte le risposte fin dal primo deploy, non aggiunti a posteriori.
- Rate limiting minimo su route di autenticazione e mutazioni.
- Ogni webhook verifica la firma della richiesta prima di processare il payload.
- Mai committare .env*, chiavi private, credenziali di terze parti — verificare .gitignore prima di scaricare qualsiasi segreto nella cartella del progetto.
- npm audit prima di ogni deploy importante; mai --force alla cieca.
```

Perché ha senso metterlo qui e non solo in questo file: `CLAUDE.md`/`AGENTS.md` viene letto automaticamente a ogni sessione futura su quel progetto specifico, quindi le regole si applicano da subito invece di essere ricostruite da zero con un audit come questo. Questo file (`sicurezza.md`) è il "master" da cui copiare il blocco quando apri un progetto nuovo.
