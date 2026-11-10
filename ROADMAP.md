# Flowstate — roadmap verso un progetto portfolio completo

Questa roadmap non è una lista di feature casuali. Ogni fase dimostra una competenza che un team SaaS cerca in un frontend engineer junior.

## 1. Product brief e criteri di successo

**Obiettivo:** definire utente, problema e flusso principale prima di aggiungere codice.

**Perché:** un buon frontend engineer non traduce soltanto mockup in componenti; capisce quale problema il prodotto deve risolvere. Nel portfolio questo rende le scelte spiegabili durante un colloquio.

**Risultato atteso:** un product brief breve, un flusso “crea → pianifica → completa” e criteri verificabili.

## 2. Dominio e gestione dello stato

**Obiettivo:** separare tipi, regole del Kanban, persistenza e componenti visuali.

**Perché:** tenere tutto in un componente funziona all'inizio, ma rende rischiose le modifiche. Un reducer puro rende le transizioni prevedibili e testabili senza browser.

**Risultato atteso:** tipi condivisi, reducer e funzioni di filtro indipendenti dalla UI.

## 3. Flusso Kanban completo

**Obiettivo:** permettere di creare, leggere, modificare, spostare, filtrare ed eliminare un task.

**Perché:** questa è la “vertical slice” del prodotto: un flusso completo vale più di molte schermate incomplete e dimostra gestione di form, stato e feedback.

**Risultato atteso:** CRUD completo, task detail, ricerca, filtri e statistiche del board.

## 4. Livello dati: demo locale + Supabase

**Obiettivo:** usare un'interfaccia repository comune per `localStorage` e Supabase.

**Perché:** il recruiter deve poter provare l'app senza configurazione, mentre il codice deve mostrare che il frontend non è legato a un solo backend. L'interfaccia evita condizioni `if` sparse nei componenti.

**Risultato atteso:** modalità demo immediata, modalità Supabase tramite variabili d'ambiente, migrazione SQL e Row Level Security.

## 5. Qualità dell'esperienza

**Obiettivo:** curare tastiera, focus, responsive, loading, errori, empty state e conferme distruttive.

**Perché:** i casi non ideali sono ciò che trasforma una demo in un prodotto credibile. Sono anche ottimi argomenti tecnici per un colloquio.

**Risultato atteso:** dialog accessibili, azioni comprensibili e interfaccia utilizzabile da mobile.

## 6. Test automatici

**Obiettivo:** coprire regole di stato e filtri, poi i flussi UI più importanti.

**Perché:** testare prima la logica pura dà il massimo valore con poca fragilità. I test UI vengono aggiunti solo ai comportamenti che l'utente percepisce.

**Risultato atteso:** test ripetibili per reducer, filtri e creazione/modifica task.

## 7. Portfolio packaging

**Obiettivo:** spiegare problema, decisioni, trade-off, architettura e prossimi passi.

**Perché:** il codice da solo costringe il recruiter a ricostruire il tuo ragionamento. Un case study breve rende visibile il modo in cui lavori.

**Risultato atteso:** README orientato al recruiter, case study, schema dati, checklist di deploy e screenshot finali.

## Definition of done

- `npm run lint`, `npm run test` e `npm run build` terminano senza errori.
- Il flusso CRUD funziona con mouse e tastiera.
- La demo funziona senza account esterni.
- Supabase può essere attivato senza cambiare i componenti.
- Il repository contiene istruzioni, motivazioni e trade-off.

## Milestone post-lancio ordinate per valore portfolio

### 8. Account persistenti — completata

**Obiettivo:** mantenere l'ingresso guest immediato, permettendo però di collegare una nuova email senza perdere i task e di recuperare un account esistente tramite magic link.

**Perché:** mostra gestione reale di sessioni, PKCE, stati asincroni e sicurezza senza mettere attrito davanti al recruiter che apre la demo.

**Risultato:** upgrade dell'identità anonima con `updateUser`, accesso passwordless, callback dedicata, logout e test UI.

### 9. Workspace e progetti multipli — completata

**Obiettivo:** sostituire i workspace decorativi con entità reali, selezione del progetto e task isolati per progetto.

**Perché:** è il passaggio che trasforma una singola board in un prodotto SaaS con un modello dati credibile.

**Risultato:** progetti persistenti, creazione e selezione dalla sidebar, task isolati per progetto, repository locale/Supabase e migrazione retrocompatibile.

### 10. Pianificazione operativa — prossima

**Obiettivo:** date ISO, task scaduti, vista “My work” e ordinamento utile.

**Perché:** aggiunge valore quotidiano e dimostra gestione corretta di date, filtri derivati e stati vuoti.

### 11. Activity log e collaborazione

**Obiettivo:** registrare creazione, modifica, spostamento e completamento dei task.

**Perché:** rende visibile la storia del prodotto e prepara commenti, membri e notifiche reali.

### 12. Esperienza mobile e qualità end-to-end

**Obiettivo:** interazioni touch, test E2E, audit accessibilità e performance.

**Perché:** chiude il divario tra feature implementata e feature affidabile in produzione.
