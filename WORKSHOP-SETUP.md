# Session: “Your Codebase Is About to Become Your Most Powerful Teammate” (Playwright + Cursor)

Goal: before the workshop starts, you can **run the app locally**, have **Cursor installed**, and have **Playwright ready**.

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

## 3) Clone the repo (app under test) + install dependencies

**If your facilitator gave you a workshop repo URL**, clone that instead and run `npm install`; then **skip to Section 5** (the database is already set up).

**Otherwise**, clone the stock starter and do Section 4:

- [ ] In a terminal, clone the repo and install dependencies:

```bash
git clone <WORKSHOP_REPO_URL_OR_STOCK_STARTER> qa-augmented-workshop
cd qa-augmented-workshop
npm install
```

Example stock starter: `https://github.com/remult/react-vite-express-starter.git`  
Example workshop repo: `https://github.com/YOUR_USERNAME/qa-augmented-workshop.git`

- [ ] Open the **qa-augmented-workshop** folder in Cursor (**File → Open Folder**)

---

## 4) Add the database (SQLite) and schema

**If you cloned the workshop repo**, the database and Counter are already set up — **skip to Section 5**.

**If you cloned the stock starter**, do the steps below before running the app. Add SQLite and a `Counter` entity so the app’s counter is persisted.

### 4a) Install the SQLite driver

From the project root:

```bash
npm install better-sqlite3
npm install -D @types/better-sqlite3
```

### 4b) Create the Counter entity

Create the folder `src/shared` (if it doesn’t exist), then create **`src/shared/Counter.ts`** with:

```ts
import { Entity, Fields } from "remult";

@Entity("counters")
export class Counter {
  @Fields.autoIncrement()
  id = 0;

  @Fields.number()
  value = 0;
}
```

### 4c) Wire the API to SQLite

Replace the contents of **`src/server/api.ts`** with:

```ts
import { remultExpress } from "remult/remult-express";
import { SqlDatabase } from "remult";
import { BetterSqlite3DataProvider } from "remult/remult-better-sqlite3";
import Database from "better-sqlite3";
import { Counter } from "../shared/Counter";

export const api = remultExpress({
  dataProvider: new SqlDatabase(
    new BetterSqlite3DataProvider(new Database("mydb.sqlite"))
  ),
  entities: [Counter],
});
```

### 4d) Wire the UI to the Counter

Replace the contents of **`src/App.tsx`** with:

```tsx
import { useEffect, useRef, useState } from "react";
import { remult } from "remult";
import { Counter } from "./shared/Counter";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

remult.apiClient.url = "/api";

function App() {
  const [count, setCount] = useState<number | null>(null);
  const counterRef = useRef<Counter | null>(null);

  useEffect(() => {
    (async () => {
      let counter = await remult.repo(Counter).findFirst();
      if (!counter) {
        counter = await remult.repo(Counter).insert({ value: 0 });
      }
      counterRef.current = counter;
      setCount(counter.value);
    })();
  }, []);

  const handleIncrement = async () => {
    const counter = counterRef.current;
    if (counter == null) return;
    counter.value += 1;
    await remult.repo(Counter).save(counter);
    setCount(counter.value);
  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={handleIncrement} disabled={count === null}>
          count is {count ?? "…"}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
```

### 4e) (Optional) Ignore the DB file in Git

Add this line to **`.gitignore`**:

```
*.sqlite
```

When you first run the API server (Step 5), **`mydb.sqlite`** will be created in the project root and Remult will create the `counters` table. The UI counter loads and saves this value.

---

## 5) Run the app locally (two terminals)

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

**Success criteria (before you join):**

- [ ] You can open the UI in the browser
- [ ] The API server process is running (no crashes)
- [ ] A **`mydb.sqlite`** file exists in the project root (created on first API run)

---

## 6) Install Playwright (TypeScript test runner)

Playwright is used for **UI tests** and **API tests**. Install from the **project root** (the folder that contains `package.json`).

- [ ] From the project root (`qa-augmented-workshop`), install Playwright Test:

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

- [ ] Create a folder for test files (optional; you can also put specs in the root):

```bash
mkdir tests
```

- [ ] Sanity check:

```bash
npx playwright --version
```

---

## 7) Cursor “ready check” (so the workshop moves fast)

- [ ] Open the repo folder in Cursor and wait for it to finish indexing (you’ll see it settle)
- [ ] Quick prompt to test repo context:
  - [ ] Ask Cursor: **“Summarize how this repo runs locally and where the API server is started.”**
- [ ] Confirm Cursor can reference files in the project when answering

---

## 8) Common issues + fixes (fast checklist)

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

- [ ] Run from the **project root** (the folder that contains `package.json` and `mydb.sqlite` after first run)
- [ ] If you see permission or pipe errors with `tsx watch`, try running the server once without watch: `npx tsx src/server/index.ts`

---

## 9) Final “I’m ready” checklist

- [ ] Cursor installed + signed in
- [ ] Repo cloned + `npm install` completed
- [ ] **Database added:** SQLite + `Counter` entity (Step 4); `mydb.sqlite` created when API runs; UI counter persists
- [ ] UI running (`npm run dev`) and loads at **http://localhost:5173**
- [ ] API running (`npm run dev-node`) at **http://localhost:3002**
- [ ] Playwright installed + browsers installed (`npx playwright --version` works)
