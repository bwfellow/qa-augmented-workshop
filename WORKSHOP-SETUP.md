# Session: “Your Codebase Is About to Become Your Most Powerful Teammate” (Playwright + Cursor)

Goal: before the workshop starts, you can **run the app locally**, have **Cursor installed**, and have **Playwright ready**.

**Live runbook:** The detailed 90-minute workshop with specific prompts, steps, and expected outputs is in **[WORKSHOP-WALKTHROUGH.md](./WORKSHOP-WALKTHROUGH.md)** (kickoff → codebase orientation → Playwright bootstrap → Page Object → API tests → data factory/seed → E2E → Q&A).

---

## 1) Install prerequisites

- [ ] Install **Node.js (LTS)** (and make sure `node` + `npm` work in your terminal)
- [ ] Install **Git**
- [ ] Have a working terminal (macOS Terminal / Windows Terminal / iTerm, etc.)
- [ ] (Optional but helpful) Install a modern browser (Chrome/Edge) for debugging

---

## 2) Install Cursor

- [ ] Download and install Cursor (macOS/Windows/Linux) from the [official download page](https://cursor.com).
- [ ] Open Cursor and **sign in** (so AI features work)

---

## 3) Clone the demo repo + install dependencies

This repo is a **demo app** with the database and UI already set up: SQLite, Remult API, and pages for **Tasks**, **Contacts**, and **Products** (with seed data).

- [ ] In a terminal, clone and install:

```bash
git clone https://github.com/bwfellow/qa-augmented-workshop.git
cd qa-augmented-workshop
npm install
```

(Or SSH: `git clone git@github.com:bwfellow/qa-augmented-workshop.git`)

- [ ] Open the **qa-augmented-workshop** folder in Cursor (**File → Open Folder**)

---

## 4) Run the app locally (two terminals)

Run the **UI** and the **API** in separate terminals (both from the project root).

### Terminal A — start the UI

- [ ] Run:

```bash
npm run dev
```

- [ ] Confirm the UI loads at: **http://localhost:5173/**

### Terminal B — start the API server

- [ ] Run:

```bash
npm run dev-node
```

- [ ] Confirm the API server is running at: **http://localhost:3002**
- [ ] Quick API check (optional but useful): open **http://localhost:3002/api/tasks** and confirm you get a JSON response

**Success criteria (before you join):**

- [ ] You can open the UI in the browser (Tasks, Contacts, Products tabs)
- [ ] The API server process is running (no crashes)
- [ ] A **`mydb.sqlite`** file appears in the project root after the first API run

---

## 5) Install Playwright (TypeScript test runner)

Playwright is used for **UI tests** and **API tests**. Install from the **project root** (the folder that contains `package.json`).

- [ ] From the project root, install Playwright Test:

```bash
npm install -D @playwright/test@latest
```

- [ ] Install browsers (recommended):

```bash
npx playwright install
```

- [ ] On Linux or if you hit dependency issues:

```bash
npx playwright install --with-deps
```

- [ ] Create a folder for test files (optional):

```bash
mkdir -p tests
```

- [ ] Sanity check:

```bash
npx playwright --version
```

---

## 6) Cursor “ready check” (so the workshop moves fast)

- [ ] Open the repo folder in Cursor and wait for it to finish indexing (you’ll see it settle)
- [ ] Quick prompt to test repo context:
  - [ ] Ask Cursor: **“Summarize how this repo runs locally and where the API server is started.”**
- [ ] Confirm Cursor can reference files in the project when answering

---

## 7) Common issues + fixes (fast checklist)

### Ports already in use (`EADDRINUSE`)

- [ ] Close other dev servers you have running
- [ ] Re-run `npm run dev` / `npm run dev-node`

### `npm install` problems

- [ ] Delete `node_modules` and re-run `npm install`
- [ ] If you’re behind a corporate proxy/VPN, try a different network

### Playwright browser download blocked (common on locked-down laptops)

- [ ] Try `npx playwright install --with-deps` (Linux)
- [ ] If downloads are blocked entirely: you can still attend as “watch-only” and copy the finished solution later

### Cursor not using repo context

- [ ] Make sure you opened the **folder**, not a single file
- [ ] Confirm you’re signed into Cursor

### API server fails (e.g. `tsx` / pipe errors)

- [ ] Run from the **project root** (the folder that contains `package.json` and, after first run, `mydb.sqlite`)
- [ ] If you see permission or pipe errors with `tsx watch`, try: `npx tsx src/server/index.ts`

---

## 8) Final “I’m ready” checklist

- [ ] Cursor installed + signed in
- [ ] Demo repo cloned + `npm install` completed
- [ ] UI running (`npm run dev`) and loads at **http://localhost:5173** (Tasks / Contacts / Products)
- [ ] API running (`npm run dev-node`) at **http://localhost:3002**
- [ ] Keep both server terminals running during workshop test execution (`npx playwright test ...`)
- [ ] Playwright installed + browsers installed (`npx playwright --version` works)
