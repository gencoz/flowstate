# Pubblicare Flowstate: guida completa per junior developer

Questa guida parte da zero e porta Flowstate da progetto locale a progetto pubblico con:

- codice su GitHub;
- database Supabase configurato;
- sito online su Vercel;
- controlli finali da portfolio.

Segui i passaggi nell'ordine indicato. Non saltare un controllo solo perché il passaggio precedente sembra riuscito.

## Prima di iniziare

Servono tre account gratuiti:

1. [GitHub](https://github.com/) per conservare e mostrare il codice;
2. [Supabase](https://supabase.com/) per database e autenticazione;
3. [Vercel](https://vercel.com/) per pubblicare il sito.

Apri PowerShell e spostati nella copia di sviluppo:

```powershell
cd "C:\Users\WORKINGSTATION GG\dev\flowstate"
```

Quando questa guida dice “terminale” intende questa finestra PowerShell.

### Tre parole da conoscere

- **Repository**: cartella del progetto con la cronologia Git.
- **Commit**: fotografia descritta delle modifiche al progetto.
- **Deploy**: versione del progetto costruita e pubblicata online.

### Regola di sicurezza

Non pubblicare mai password, token o chiavi `secret`/`service_role`. Flowstate usa nel browser soltanto la chiave **publishable**, che è progettata per essere pubblica e viene limitata dalle regole RLS del database.

---

## Fase 1 — Controllare il progetto locale

### 1. Controlla le versioni

Nel terminale esegui:

```powershell
node --version
npm --version
git --version
```

Risultato atteso:

- Node inizia con `v24`;
- npm inizia con `11`;
- Git stampa una versione senza errori.

Se npm mostra una versione precedente alla 11, chiudi e riapri PowerShell. Se non cambia, verifica la versione inclusa nell'installazione di Node:

```powershell
& "C:\Program Files\nodejs\node.exe" "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" --version
```

### 2. Installa esattamente le dipendenze bloccate

```powershell
npm ci
```

Perché usiamo `npm ci` invece di `npm install`: legge il lockfile senza scegliere versioni nuove. È il modo più vicino a ciò che farà il server di pubblicazione.

### 3. Esegui il quality gate

Esegui un comando alla volta:

```powershell
npm run lint
npm run test:coverage
npm run build
```

Devi vedere:

- lint senza errori;
- `7 passed` nei test;
- `Compiled successfully` nella build.

Se uno fallisce, non procedere al deploy. Il primo errore mostrato è normalmente quello da risolvere; gli errori successivi possono esserne una conseguenza.

---

## Fase 2 — Pubblicare il codice su GitHub

### 4. Crea un repository vuoto

1. Accedi a [GitHub](https://github.com/).
2. In alto a destra premi `+` e poi **New repository**.
3. In **Repository name** scrivi `flowstate`.
4. Come descrizione puoi usare:

   `A production-minded Kanban workspace built with Next.js, TypeScript, Tailwind and Supabase.`

5. Seleziona **Public**: per un progetto portfolio permette ai recruiter di vedere il codice.
6. Non selezionare README, `.gitignore` o licenza: esistono già localmente e crearli di nuovo può produrre un conflitto.
7. Premi **Create repository**.

Lascia aperta la pagina appena creata.

### 5. Collega il progetto locale a GitHub

Sostituisci `TUO-USERNAME` con il tuo username GitHub:

```powershell
git remote add origin https://github.com/TUO-USERNAME/flowstate.git
git remote -v
```

Il secondo comando deve mostrare lo stesso indirizzo per `fetch` e `push`.

Se compare `remote origin already exists`, usa:

```powershell
git remote set-url origin https://github.com/TUO-USERNAME/flowstate.git
```

### 6. Invia il branch principale

```powershell
git push -u origin main
```

Al primo push Windows può aprire il browser per autorizzare GitHub. Completa il login e torna al terminale.

Risultato atteso: il comando termina senza errori e la pagina GitHub, dopo un aggiornamento, mostra i file del progetto.

### 7. Controlla GitHub Actions

1. Nel repository GitHub apri la scheda **Actions**.
2. Apri il workflow più recente.
3. Attendi che installazione, lint, test e build diventino verdi.

Perché serve: dimostra che il progetto non funziona soltanto sul tuo computer. GitHub ricontrolla automaticamente ogni push e ogni pull request.

---

## Fase 3 — Creare il backend Supabase

### 8. Crea il progetto

1. Accedi al [dashboard Supabase](https://supabase.com/dashboard).
2. Premi **New project**.
3. Se richiesto, crea o seleziona un'organizzazione.
4. Usa `Flowstate` come nome.
5. Genera una password database forte e salvala in un password manager. Non inserirla nel repository.
6. Scegli una regione vicina agli utenti, per esempio una regione europea se il portfolio è rivolto all'Europa.
7. Seleziona il piano gratuito e crea il progetto.
8. Attendi che lo stato del progetto sia pronto.

### 9. Abilita gli utenti anonimi

Flowstate crea un utente temporaneo per ogni browser, senza chiedere registrazione.

1. Nel progetto Supabase apri **Authentication**.
2. Apri le impostazioni dei provider o dei metodi di accesso.
3. Cerca **Anonymous Sign-Ins**.
4. Attiva l'opzione e salva.

Nota importante: cancellando i dati del browser o usando un altro dispositivo si crea un altro utente e quindi una board separata. Per questa demo è il comportamento previsto.

Prima di condividere ampiamente il sito, configura anche CAPTCHA o Cloudflare Turnstile nelle impostazioni Auth. Riduce la creazione automatizzata di utenti anonimi.

### 10. Recupera il Project Ref

Guarda l'indirizzo del dashboard:

```text
https://supabase.com/dashboard/project/abcdefghijklmno
```

La parte dopo `/project/`, nell'esempio `abcdefghijklmno`, è il **Project Ref**. Copialo temporaneamente.

### 11. Inizializza gli strumenti Supabase

Nel terminale, sempre dentro la cartella di Flowstate:

```powershell
npx supabase@latest init
npx supabase@latest login
```

- `init` crea la configurazione locale di Supabase, ma non modifica ancora il database online.
- `login` apre il browser o chiede un token per autorizzare il terminale.

Se `init` dice che il progetto è già inizializzato, puoi continuare.

### 12. Collega il progetto online

Sostituisci `IL-TUO-PROJECT-REF`:

```powershell
npx supabase@latest link --project-ref IL-TUO-PROJECT-REF
```

Quando viene richiesta la database password, usa quella salvata al passaggio 8. Mentre la digiti potresti non vedere caratteri: è normale per i campi password del terminale.

Risultato atteso: `Finished supabase link`.

### 13. Controlla la migrazione prima di applicarla

```powershell
npx supabase@latest db push --remote --dry-run
```

`--dry-run` significa “mostrami cosa accadrebbe senza cambiare niente”. Controlla che:

- il progetto di destinazione sia Flowstate;
- venga proposta `001_create_tasks.sql`;
- non compaiano operazioni di eliminazione inattese.

### 14. Crea tabella e regole di sicurezza

Solo dopo il controllo precedente esegui:

```powershell
npx supabase@latest db push --remote
```

Conferma quando richiesto.

La migrazione crea la tabella `tasks`, abilita Row Level Security e permette a ogni utente di leggere e modificare soltanto i propri task.

### 15. Controlla il risultato nel dashboard

1. In Supabase apri **Table Editor**.
2. Verifica che esista la tabella `tasks`.
3. Apri la sezione delle policy/RLS.
4. Verifica che RLS sia attivo e siano presenti quattro policy: lettura, creazione, aggiornamento ed eliminazione.

Non creare la tabella una seconda volta dal Table Editor: lo schema deve continuare a essere gestito dalla migrazione versionata.

---

## Fase 4 — Collegare Flowstate a Supabase in locale

### 16. Recupera URL e chiave corretti

1. Nel dashboard Supabase premi **Connect**, oppure apri **Settings → API Keys**.
2. Copia il **Project URL**, simile a `https://abcdefghijklmno.supabase.co`.
3. Copia la **Publishable key**, che inizia normalmente con `sb_publishable_`.

Non copiare la secret key e non usare `service_role`.

### 17. Crea il file locale delle variabili

Nel terminale:

```powershell
Copy-Item .env.example .env.local
notepad .env.local
```

Sostituisci il contenuto con:

```env
NEXT_PUBLIC_DATA_MODE=supabase
NEXT_PUBLIC_SUPABASE_URL=https://IL-TUO-PROGETTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_LA_TUA_CHIAVE
```

Anche se la variabile mantiene il nome storico `ANON_KEY`, il valore consigliato è la nuova publishable key.

Salva e chiudi Blocco note.

### 18. Controlla che il file non finisca su GitHub

```powershell
git status --short
```

`.env.local` non deve comparire. È escluso da `.gitignore`.

Se compare, non eseguire `git add .`: verifica prima `.gitignore`.

### 19. Prova il database reale

```powershell
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) e prova questa sequenza:

1. crea un task riconoscibile, per esempio `Test Supabase`;
2. modifica titolo o priorità;
3. spostalo in un'altra colonna;
4. aggiorna la pagina con `Ctrl+R`;
5. verifica che il task sia ancora presente;
6. cancellalo e aggiorna nuovamente.

Nel Table Editor di Supabase dovresti vedere la riga mentre il task esiste.

Per fermare il server torna nel terminale e premi `Ctrl+C`.

### 20. Salva la configurazione non segreta

Controlla cosa è cambiato:

```powershell
git status
```

Poi salva la configurazione Supabase generata da `init`:

```powershell
git add supabase/config.toml
git commit -m "Configure Supabase project workflow"
git push
```

Se Git dice che `supabase/config.toml` non esiste o non è cambiato, esegui `git status` e aggiungi soltanto i file non segreti indicati. Non aggiungere mai `.env.local` o la cartella `supabase/.temp`.

---

## Fase 5 — Pubblicare Flowstate su Vercel

### 21. Collega Vercel a GitHub

1. Accedi a [Vercel](https://vercel.com/) usando GitHub.
2. Nel dashboard premi **Add New… → Project**.
3. Se richiesto, autorizza l'app Vercel per il repository `flowstate`.
4. Trova `flowstate` nell'elenco e premi **Import**.

### 22. Controlla le impostazioni del progetto

Vercel dovrebbe riconoscere automaticamente:

- Framework Preset: **Next.js**;
- Root Directory: `./`;
- Build Command: `next build` o valore automatico;
- Production Branch: `main`.

Non modificare Output Directory e non aggiungere un `vercel.json`: per questo progetto non servono.

### 23. Inserisci le variabili d'ambiente

Prima di premere Deploy, apri **Environment Variables** e aggiungi:

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_DATA_MODE` | `supabase` |
| `NEXT_PUBLIC_SUPABASE_URL` | il Project URL di Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | la publishable key |

Se Vercel permette di scegliere gli ambienti, seleziona **Production**, **Preview** e **Development** per tutte e tre.

Controlla attentamente che non ci siano spazi prima o dopo i valori.

### 24. Avvia il deploy

Premi **Deploy** e attendi.

Risultato atteso:

- build completata;
- schermata di successo;
- URL simile a `https://flowstate-qualcosa.vercel.app`.

Se modifichi in seguito una variabile d'ambiente, devi avviare un nuovo deploy: le modifiche non vengono applicate alle versioni già costruite.

---

## Fase 6 — Verifica finale da portfolio

### 25. Prova il sito come un visitatore nuovo

Apri l'URL Vercel in una finestra privata/incognito e verifica:

- la pagina si carica senza errori;
- puoi creare, modificare, spostare ed eliminare un task;
- il task rimane dopo il refresh;
- ricerca e filtri funzionano;
- il dialog si usa anche con la tastiera;
- il layout funziona con una finestra stretta come uno smartphone.

Apri anche gli strumenti sviluppatore del browser e controlla che la Console non mostri errori rossi.

### 26. Controlla il database

Nel dashboard Supabase:

1. apri `tasks` nel Table Editor;
2. verifica che il task di prova abbia un `user_id`;
3. apri il sito in un'altra finestra privata: non deve vedere i task della prima sessione.

Quest'ultimo controllo dimostra che le policy RLS isolano correttamente i dati.

### 27. Aggiorna la presentazione del progetto

Quando hai l'URL definitivo:

1. aggiungilo vicino al titolo del README;
2. aggiungi il link GitHub e il link live alla scheda del tuo portfolio;
3. cattura uno screenshot desktop e uno mobile;
4. aggiorna `CASE_STUDY.md` con i risultati reali;
5. crea un ultimo commit e invialo:

```powershell
git add README.md CASE_STUDY.md
git commit -m "Add live demo and portfolio results"
git push
```

Vercel rileverà automaticamente il push su `main` e pubblicherà una nuova versione.

---

## Se qualcosa non funziona

### `npm` si blocca durante l'installazione

- verifica `node --version` e `npm --version`;
- lavora nella cartella corta `C:\Users\WORKINGSTATION GG\dev\flowstate`;
- chiudi eventuali server `npm run dev` ancora aperti;
- riprova con `npm ci`.

### `git push` dice `repository not found`

Controlla username e indirizzo:

```powershell
git remote -v
```

Correggilo con:

```powershell
git remote set-url origin https://github.com/TUO-USERNAME/flowstate.git
```

### Il workflow GitHub è rosso

Apri il job fallito e cerca il primo messaggio che contiene `Error`. Riproduci localmente lo stesso comando indicato, per esempio `npm run build`, prima di fare un nuovo push.

### `supabase link` non riesce

Controlla:

- di essere dentro la cartella Flowstate;
- di avere eseguito `npx supabase@latest login`;
- che il Project Ref sia quello nell'URL del dashboard;
- che la password sia la database password, non la password dell'account Supabase.

### `db push` non trova migrazioni

Verifica che esista:

```text
supabase/migrations/001_create_tasks.sql
```

e che il comando venga eseguito dalla radice del progetto.

### Il sito online resta in Demo mode

In Vercel apri **Project → Settings → Environment Variables** e controlla che:

```text
NEXT_PUBLIC_DATA_MODE=supabase
```

Poi vai in **Deployments** e avvia un redeploy.

### Errore Supabase oppure task che non restano dopo il refresh

Controlla nell'ordine:

1. Project URL corretto;
2. publishable key corretta;
3. Anonymous Sign-Ins abilitato;
4. tabella `tasks` presente;
5. RLS attivo con le quattro policy;
6. nuovo deploy Vercel dopo ogni modifica alle variabili.

### La board è vuota in una nuova finestra privata

È normale. Ogni finestra privata crea un nuovo utente anonimo, quindi riceve una board personale vuota.

---

## Checklist conclusiva

- [ ] Quality gate locale verde
- [ ] Repository GitHub pubblico e leggibile
- [ ] GitHub Actions verde
- [ ] Progetto Supabase creato
- [ ] Anonymous Sign-Ins abilitato
- [ ] Migrazione applicata con `db push`
- [ ] Test CRUD locale riuscito
- [ ] Variabili Vercel configurate
- [ ] Deploy Vercel riuscito
- [ ] Test in incognito riuscito
- [ ] Isolamento RLS verificato
- [ ] README aggiornato con demo live
- [ ] Screenshot desktop e mobile aggiunti al portfolio

Quando tutte le caselle sono selezionate, Flowstate è realmente pronto per essere mostrato in candidatura e discusso durante un colloquio.
