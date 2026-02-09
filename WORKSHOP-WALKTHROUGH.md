# Workshop: “Your Codebase Is About to Become Your Most Powerful Teammate”

**This is your workshop companion.** Keep this doc open during the session and use it as you go: **copy and paste the prompts** into Cursor, **compare your code** to the snippets below each step, and **run the commands** when the step says to. Pre-workshop setup (Node, Cursor, clone, run app, install Playwright) is in [WORKSHOP-SETUP.md](./WORKSHOP-SETUP.md).

**This doc has everything you need to run the full workshop:** every prompt to paste in Cursor, every code snippet to compare against, every test we run (smoke, add-task UI, API happy/negative, seed-3-tasks, E2E), every command (`npx playwright test ...`), and every file path. You don’t need to look elsewhere mid-session.

**Duration:** 90 minutes (75 min build + 15 min Q&A)  
**Format:** 100% live (builders + watchers welcome)  
**Outcome by minute 75:** Playwright UI + API tests, a Page Object, and a data factory/seed helper.

---

## 0:00–0:05 — Kickoff + Definition of Done

### Step 1 — Kickoff and success criteria

**Action:**

- [ ] Welcome the group and state today’s goal: **codebase-first testing** with Playwright and Cursor.
- [ ] **Builders:** Confirm UI and API run locally (see [WORKSHOP-SETUP.md](./WORKSHOP-SETUP.md)). **Watchers:** Follow along; you can copy the repo and run tests afterward.
- [ ] Read aloud the **success criteria** (everyone leaves with the same outcomes):
  - One passing Playwright **smoke test** (app reachable).
  - One **UI test** that uses a **Page Object** (add task on Tasks page).
  - At least **two API tests** (one happy path, one negative) for `/api/tasks`.
  - A **data factory** + **seed helper** used by at least one test.
  - One **end-to-end** scenario: seed via API → verify in UI → toggle complete → assert.

**Deliverable:** Everyone has heard the same success criteria.

### Step 2 — Repo structure (everyone uses the same map)

**Action:**

- [ ] Tell everyone: we will use **only these paths** for the whole workshop. Point to each:
  - **Client:** `src/App.tsx`, `src/pages/*.tsx`, `src/main.tsx` — Vite at **http://localhost:5173** (proxies `/api` to the API).
  - **Server:** `src/server/index.ts` (Express), `src/server/api.ts` (Remult + entities) — API at **http://localhost:3002**.
  - **Shared:** `src/shared/Task.ts`, `Contact.ts`, `Product.ts` — entity definitions and validation.
- [ ] Do **not** add or rename these; everyone’s mental map is identical.

**Deliverable:** Everyone knows the end state and the exact same file/port map.

### Step 3 — Hard rule for this workshop (codebase only)

**Action:**

- [ ] Read aloud this rule: **“For discovery, use only the repo code + Cursor. Do not use Swagger, Postman, or browser inspector to find endpoints, payload shapes, or locators.”**
- [ ] Tell everyone this is the core skill being practiced: extracting test truth from `src/server/*`, `src/shared/*`, and `src/pages/*`.

**Deliverable:** Everyone agrees to a codebase-only workflow for discovery.

---

## 0:05–0:15 — Codebase-First Orientation (Repo as Source of Truth)

Goal: Identify **where the API starts**, **where validation lives**, and the **exact UI flows** we will automate. Lock the “Test Targets” list so everyone tests the same things.

### Step 1 — Where the API starts and routes are registered

**Action:**

- [ ] Paste this exact prompt in Cursor (or read it aloud and have everyone paste it):  
  **“In this repo, where does the API server start and where are API routes registered? List the exact file paths and the port.”**
- [ ] Verify the answer includes: **Entry** `src/server/index.ts` (port **3002**); **Routes** in `src/server/api.ts` — `GET/POST /api/tasks`, `GET/POST /api/contacts`, `GET/POST /api/products` (and `/:id` for GET/PUT/DELETE). If anything is missing, ask Cursor to add the missing path or port.

**Deliverable:** Everyone has the same answer: server entry and API routes with exact paths and port.

### Step 2 — Where data models and validation live (what can fail and why)

**Action:**

- [ ] Paste this exact prompt in Cursor:  
  **“Where are the data models for Task, Contact, and Product defined? What fields are required or have constraints that could make API or form submission fail?”**
- [ ] Verify the answer names **files** `src/shared/Task.ts`, `Contact.ts`, `Product.ts`; **Task** fields title, description, priority; **Contact** name/email required and email format in `ContactsPage.tsx`; **Product** seeded in `api.ts`. Do not add extra entities or validators — we use only these three entities for the workshop.

**Deliverable:** Everyone agrees on the same three entities and where validation lives (client for Contact).

### Step 3 — Which UI flows we will automate (fixed list)

**Action:**

- [ ] Paste this exact prompt in Cursor:  
  **“List the main user-facing flows on the Tasks and Contacts pages that would be good candidates for UI automation. Mention the page file and the main elements (buttons, inputs) by label or id if present.”**
- [ ] From the answer, we use **only these two flows** for the workshop:  
  (1) **Tasks** (`src/pages/TasksPage.tsx`): Add task (Title, Priority, Description → “Add Task”), filter All/Active/Completed, toggle complete (checkbox).  
  (2) **Contacts** (`src/pages/ContactsPage.tsx`): Add contact (Name, Email, Phone, Company → “Add Contact” / “Update Contact”), search.  
- [ ] Do **not** add edit/delete or other flows to the workshop list; everyone automates the same flows.

**Deliverable:** Everyone has the same two flows (Tasks add/filter/toggle; Contacts add/search).

### Step 4 — Lock the Test Targets list (everyone uses the same list)

**Action:**

- [ ] Read the inlined **Test Targets** below as a group. This list is the single source of truth for what to automate in this workshop.
- [ ] Do **not** add or remove items during the live session.

**Deliverable:** Everyone aligned on the exact same test targets (no one adds “delete contact” or extra endpoints for the live session).

**Test Targets (source of truth for this workshop):**

- **API (base URL: http://localhost:3002)**
  - `GET /api/tasks`, `POST /api/tasks` — happy path + empty/invalid payload
  - `GET /api/contacts`, `POST /api/contacts` — happy path + validation (e.g. missing name/email, bad email format)
  - `GET /api/products` — list (products are seeded in `src/server/api.ts`)
- **UI (base URL: http://localhost:5173)**
  - Smoke: app loads, nav visible (Tasks | Contacts | Products)
  - Tasks: add task -> appears in list; filter All/Active/Completed; toggle complete; edit; delete
  - Contacts: add contact (required name/email); search; edit; delete (confirm dialog)
- **Risks to cover**
  - API: POST with missing required fields or invalid types
  - UI: form validation messages (Contacts); empty states; filter and count updates

### Step 5 — Blind challenge (prove codebase-only discovery works)

**Action:**

- [ ] Timebox to 3 minutes. Ask everyone to close browser devtools and avoid opening API docs/tools.
- [ ] Paste this exact prompt in Cursor:  
  **“Using only this repo’s code, produce: (1) a list of `/api/tasks` endpoints with methods and expected request fields, and (2) robust locators for the Tasks add form and task row interactions. Include exact file paths used as evidence.”**
- [ ] Verify answers include path evidence (`src/server/api.ts`, `src/shared/Task.ts`, `src/pages/TasksPage.tsx`, `src/App.tsx`).

**Deliverable:** Everyone demonstrates endpoint + locator discovery directly from source files.

---

## 0:15–0:30 — Playwright Bootstrap + First Passing Test

Goal: Add **config** and **folder layout**, then write **one smoke test** that proves the app is reachable. Everyone produces the same config and same test.

**Prerequisite:** Playwright and browsers should already be installed (see [WORKSHOP-SETUP.md](./WORKSHOP-SETUP.md) section 5). If anyone skipped that, have them run: `npm install -D @playwright/test@latest` and `npx playwright install` now.

### Step 1 — Confirm Playwright + create test folder

**Action:**

- [ ] From project root, run: `mkdir -p tests`
- [ ] Run: `npx playwright --version` — it must print a version (e.g. `1.49.0`). If not, use setup doc section 5.

**Deliverable:** Folder `tests/` exists and Playwright version prints for everyone.

### Step 2 — Add Playwright config (exact same file for everyone)

**Action:**

- [ ] Paste this exact prompt in Cursor:  
  **“Add `playwright.config.ts` in the repo root. Use TypeScript with `testDir: './tests'`, `baseURL: 'http://localhost:5173'`, and one Chromium project. Do not configure `webServer` because the app and API are started separately before tests.”**
- [ ] Confirm the file **`playwright.config.ts`** exists at the repo root and contains `baseURL: 'http://localhost:5173'` and `testDir: './tests'`. If baseURL is wrong or missing, prompt: **“Set baseURL to http://localhost:5173 in playwright.config.ts.”**

**Compare your code to:**

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
```

**Deliverable:** Everyone has the same `playwright.config.ts` with the same baseURL and testDir.

### Step 3 — First smoke test (exact same test for everyone)

**Action:**

- [ ] Paste this exact prompt in Cursor:  
  **“In `tests/smoke.spec.ts`, create one smoke test that goes to `'/'`, scopes to the navigation landmark, and asserts nav brand text plus buttons Tasks/Contacts/Products are visible. Use role-based locators with `const nav = page.getByRole('navigation')` and assert within `nav`.”**
- [ ] Confirm the file **`tests/smoke.spec.ts`** exists and the test title is **“app loads and nav is visible”** (or equivalent). Keep selectors scoped to `page.getByRole('navigation')`.

**Deliverable:** Everyone has the same `tests/smoke.spec.ts` with one test that checks “QA Workshop” and the three nav buttons.

**Compare your code to:**

```ts
import { test, expect } from '@playwright/test';

test('app loads and nav is visible', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation');
  await expect(nav.getByText('QA Workshop')).toBeVisible();
  await expect(nav.getByRole('button', { name: 'Tasks' })).toBeVisible();
  await expect(nav.getByRole('button', { name: 'Contacts' })).toBeVisible();
  await expect(nav.getByRole('button', { name: 'Products' })).toBeVisible();
});
```

### Step 4 — Run smoke test (everyone runs the same command)

**Action:**

- [ ] Ensure app and API are already running (`npm run dev` and `npm run dev-node` in separate terminals), then run from repo root: **`npx playwright test tests/smoke.spec.ts`**.
- [ ] If it fails: (1) Timeout → verify UI is reachable at http://localhost:5173 and API at http://localhost:3002. (2) Selector not found → prompt Cursor: **“Scope the smoke test assertions to `page.getByRole('navigation')` and use role-based button locators.”** Re-run until it passes.

**Deliverable:** One passing Playwright test; everyone ran the same command and got a pass.

---

## 0:30–0:45 — Locators Without Opening a Browser + First Page Object

Goal: Derive locators from the codebase; create the **same** Page Object and UI test; add **the same** `data-testid`s; update the POM to use them. Everyone ends up with the same files and same test data.

### Step 1 — Derive locators (everyone uses the same selectors)

**Action:**

- [ ] Paste this exact prompt in Cursor:  
  **“Look at `src/App.tsx` and `src/pages/TasksPage.tsx`. List robust selectors for a Tasks POM using constructor locator fields: Tasks nav button, add-task form, title input, description input, priority dropdown, Add Task button, and task rows. Prefer role/label/testid. If task rows do not have a testid yet, use `.locator('.task-item')` as a temporary selector until we add one.”**
- [ ] Confirm we will use these selectors in the POM constructor: `getByRole('button', { name: 'Tasks' })`, `getByLabel('Title')`, `getByLabel('Description')`, `getByLabel('Priority')`, `getByRole('button', { name: 'Add Task' })`, and temporary `locator('.task-item')` until testids are added.

**Deliverable:** Everyone has the same selector list for the Tasks page.

### Step 2 — Create the first Page Object (exact same file for everyone)

**Action:**

- [ ] Paste this exact prompt in Cursor:  
  **“Create `tests/pages/TasksPage.ts` with a `TasksPageObject` class using the constructor locator model: define readonly `Locator` fields in the constructor (`tasksNavButton`, `addTaskForm`, `titleInput`, `descriptionInput`, `prioritySelect`, `addTaskButton`, `taskItems`). Add methods: `goto()`, `addTask(title, description?, priority?)`, `getTaskItems()`, `taskRowByTitle(title)`, and `taskCheckboxByTitle(title)`.”**
- [ ] Confirm the file **`tests/pages/TasksPage.ts`** exists and exports **`TasksPageObject`** with constructor locator fields and those methods.

**Compare your code to (initial POM, before testids):**

```ts
import { expect, type Locator, type Page } from '@playwright/test';

export class TasksPageObject {
  readonly tasksNavButton: Locator;
  readonly addTaskForm: Locator;
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly prioritySelect: Locator;
  readonly addTaskButton: Locator;
  readonly taskItems: Locator;

  constructor(private readonly page: Page) {
    this.tasksNavButton = page.getByRole('button', { name: 'Tasks' });
    this.addTaskForm = page.locator('form').filter({ has: page.getByRole('heading', { name: 'Add New Task' }) });
    this.titleInput = page.getByLabel('Title');
    this.descriptionInput = page.getByLabel('Description');
    this.prioritySelect = page.getByLabel('Priority');
    this.addTaskButton = page.getByRole('button', { name: 'Add Task' });
    this.taskItems = page.locator('.task-item');
  }

  async goto() {
    await this.page.goto('/');
    await this.tasksNavButton.click();
    await expect(this.addTaskForm).toBeVisible();
  }

  async addTask(title: string, description = '', priority: 'low' | 'medium' | 'high' = 'medium') {
    await this.titleInput.fill(title);
    await this.descriptionInput.fill(description);
    await this.prioritySelect.selectOption(priority);
    await this.addTaskButton.click();
  }

  getTaskItems() {
    return this.taskItems;
  }

  taskRowByTitle(title: string) {
    return this.taskItems.filter({ has: this.page.getByText(title, { exact: true }) }).first();
  }

  taskCheckboxByTitle(title: string) {
    return this.taskRowByTitle(title).getByRole('checkbox');
  }
}
```

**Deliverable:** Everyone has the same `tests/pages/TasksPage.ts` and same class name.

### Step 3 — UI test using the Page Object (exact same test for everyone)

**Action:**

- [ ] Paste this exact prompt in Cursor:  
  **“Add a test in `tests/tasks.spec.ts` that uses `TasksPageObject`, calls `goto()`, records initial row count, adds `Workshop task` with description `From Playwright` and priority `high`, then asserts row count increases by 1 and `taskRowByTitle('Workshop task')` is visible.”**
- [ ] Confirm the file **`tests/tasks.spec.ts`** exists and the test uses **title 'Workshop task'**, **description 'From Playwright'**, **priority 'high'**. Do not change these strings — everyone’s test must use the same data.
- [ ] Run: **`npx playwright test tests/tasks.spec.ts`** and fix until it passes.

**Deliverable:** Everyone has the same `tests/tasks.spec.ts` with the same task title/description/priority and a passing test.

**Compare your code to (add-task test in tests/tasks.spec.ts):**

```ts
import { test, expect } from '@playwright/test';
import { TasksPageObject } from './pages/TasksPage';

test('add task and see it in list', async ({ page }) => {
  const tasksPage = new TasksPageObject(page);
  await tasksPage.goto();
  const initialCount = await tasksPage.getTaskItems().count();
  await tasksPage.addTask('Workshop task', 'From Playwright', 'high');
  await expect(tasksPage.getTaskItems()).toHaveCount(initialCount + 1);
  await expect(tasksPage.taskRowByTitle('Workshop task')).toBeVisible();
});
```

### Step 4 — Add data-testid to the app (exact same attributes for everyone)

**Action:**

- [ ] Paste this exact prompt in Cursor:  
  **“In src/pages/TasksPage.tsx add data-testid attributes: (1) data-testid='task-item' on the outer div of each task row (the div with className task-item), (2) data-testid='add-task-form' on the Add New Task form element. Keep all existing labels and ids.”**
- [ ] Verify **only these two** testids were added: **`data-testid="task-item"`** on the task row div, **`data-testid="add-task-form"`** on the form. No other data-testid in this file.

**Deliverable:** Everyone has the same two testids in `TasksPage.tsx`.

### Step 5 — Update the POM to use the new testids (everyone makes the same change)

**Action:**

- [ ] Paste this exact prompt in Cursor:  
  **“Update `tests/pages/TasksPage.ts` to use testids: `addTaskForm = page.getByTestId('add-task-form')` and `taskItems = page.getByTestId('task-item')`. Keep constructor locator fields, and keep `taskRowByTitle(title)` / `taskCheckboxByTitle(title)` targeting rows by title rather than index.”**
- [ ] Run: **`npx playwright test tests/tasks.spec.ts`** — it must still pass.

**Deliverable:** Everyone’s POM uses `getByTestId('task-item')` and `getByTestId('add-task-form')` in constructor locator fields; same passing test.

**Compare your code to (after adding testids — these constructor assignments in the POM):**

```ts
this.addTaskForm = page.getByTestId('add-task-form');
this.taskItems = page.getByTestId('task-item');
```

---

## 0:45–1:00 — API Tests Without Swagger/Postman

Goal: Add **two** Playwright API tests for `/api/tasks`: one happy path, one negative. Everyone uses the same file name, same test names, and same assertions.

### Step 1 — Agree on request/response shape (everyone uses the same)

**Action:**

- [ ] Paste this exact prompt in Cursor:  
  **“For the Remult API in this repo: what is the exact JSON body to POST a new task to /api/tasks and what does the API return? Use src/shared/Task.ts.”**
- [ ] Confirm we use **only** POST body: `title`, `description`, `priority` ('low'|'medium'|'high'). Response has `id` and `title`. Do not add Contact or Product in this step — we test only tasks.

**Deliverable:** Everyone agrees on the same request shape and response fields for POST /api/tasks.

### Step 2 — Create API test file (exact same tests for everyone)

**Action:**

- [ ] Paste this exact prompt in Cursor:  
  **“Create `tests/api/tasks.api.spec.ts`. Use `APIRequestContext` with `playwright.request.newContext({ baseURL: 'http://localhost:3002' })` in `beforeAll`, dispose in `afterAll`. Add two tests: (1) `POST /api/tasks - happy path` with body `{ title: 'API task', description: 'From API test', priority: 'high' }`, expect status 201 and response with numeric `id` and exact title. (2) `GET /api/tasks/:id - missing task` using id `999999`, expect 404. Keep `failOnStatusCode: false` for the negative request.”**
- [ ] Confirm the file **`tests/api/tasks.api.spec.ts`** exists with those two tests and explicit status assertions (201 and 404).

**Compare your code to:**

```ts
import { test, expect, playwright, type APIRequestContext } from '@playwright/test';

let api: APIRequestContext;

test.beforeAll(async () => {
  api = await playwright.request.newContext({ baseURL: 'http://localhost:3002' });
});

test.afterAll(async () => {
  await api.dispose();
});

test('POST /api/tasks - happy path', async () => {
  const response = await api.post('/api/tasks', {
    data: { title: 'API task', description: 'From API test', priority: 'high' },
  });
  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body.id).toEqual(expect.any(Number));
  expect(body.title).toBe('API task');
});

test('GET /api/tasks/:id - missing task', async () => {
  const response = await api.get('/api/tasks/999999', { failOnStatusCode: false });
  expect(response.status()).toBe(404);
});
```

**Deliverable:** Everyone has the same `tests/api/tasks.api.spec.ts` with the same two test names and assertions.

### Step 3 — Run API tests (everyone runs the same command)

**Action:**

- [ ] Run: **`npx playwright test tests/api/`**
- [ ] Fix any failures (e.g. wrong base URL or assertion) so both tests pass. Keep test names and assertions identical across the room.

**Deliverable:** Everyone ran the same command and has two passing API tests.

### Step 4 — Add schema-derived contract assertions

**Action:**

- [ ] Paste this exact prompt in Cursor:  
  **“Update `tests/api/tasks.api.spec.ts` to add contract assertions derived from `src/shared/Task.ts`: in the happy-path POST response, assert `id` is number, `title` and `description` are strings, `priority` is one of `low|medium|high`, and `completed` is boolean.”**
- [ ] Confirm contract assertions are type/shape focused and come from the entity schema (not guessed from external docs).
- [ ] Re-run: **`npx playwright test tests/api/tasks.api.spec.ts`**

**Deliverable:** API tests now check both status and schema-derived response contract.

---

## 1:00–1:10 — Data Factories + Seeding Helpers

Goal: One **task** factory and one **seed helper** for tasks; use them in **one** test that seeds **exactly 3** tasks. Everyone uses the same file names, same default values, and same seed count.

### Step 1 — Create task factory (exact same file for everyone)

**Action:**

- [ ] Paste this exact prompt in Cursor: **"Create `tests/factories/task.ts` with a typed `TaskInput` and `buildTask(overrides?: Partial<TaskInput>): TaskInput`. Defaults: title `'Test Task'`, description `''`, priority `'medium'` (`'low' | 'medium' | 'high'`)."**
- [ ] Confirm the file **`tests/factories/task.ts`** exists and exports **`buildTask`** with exactly those defaults. Do not add a Contact factory in this step — we use only the task factory for the workshop.

**Compare your code to:**

```ts
export type TaskInput = {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
};

export function buildTask(overrides: Partial<TaskInput> = {}): TaskInput {
  return {
    title: 'Test Task',
    description: '',
    priority: 'medium',
    ...overrides,
  };
}
```

**Deliverable:** Everyone has the same `tests/factories/task.ts` and same default values.

### Step 2 — Create seed helper (exact same file for everyone)

**Action:**

- [ ] Paste this exact prompt in Cursor: **"Create `tests/helpers/seed.ts`. Export `seedTasks(api: APIRequestContext, count: number, overrides?: Partial<TaskInput>)`. Use `buildTask` from `tests/factories/task.ts`, POST to `/api/tasks`, and fail fast on non-201 responses. Return created tasks with `{ id, title }`."**
- [ ] Confirm the file **`tests/helpers/seed.ts`** exists and exports **`seedTasks`** with typed parameters/return shape.

**Compare your code to (shape of seed helper):**

```ts
import { expect, type APIRequestContext } from '@playwright/test';
import { buildTask, type TaskInput } from '../factories/task';

export async function seedTasks(
  api: APIRequestContext,
  count: number,
  overrides: Partial<TaskInput> = {}
) {
  const created: { id: number; title: string }[] = [];
  for (let i = 0; i < count; i++) {
    const body = buildTask({
      title: `Seed task ${i + 1}`,
      ...overrides,
    });
    const response = await api.post('/api/tasks', { data: body });
    expect(response.status(), `seed task ${i + 1}`).toBe(201);
    created.push(await response.json());
  }
  return created;
}
```

(You'll need to import `buildTask` from your task factory.)

**Deliverable:** Everyone has the same `tests/helpers/seed.ts` and same helper signature.

### Step 3 — Add test that uses factory + seed (exact same test for everyone)

**Action:**

- [ ] Paste this exact prompt in Cursor: **"In `tests/tasks.spec.ts`, add a test that creates an API request context (`baseURL: 'http://localhost:3002'`), calls `seedTasks(api, 3, { title: 'Seed task workshop' })`, opens Tasks via `TasksPageObject.goto()`, and asserts exactly 3 rows containing `'Seed task workshop'` are visible. Dispose the API context at the end of the test."**
- [ ] Confirm the new test seeds **exactly 3** tasks and asserts **exactly 3 matching rows** for the seeded title.
- [ ] Run: **`npx playwright test tests/tasks.spec.ts`** and fix until all tests pass.

**Deliverable:** Everyone has the same test that seeds 3 tasks and asserts 3 rows; all tests pass.

### Step 4 — Add one more factory from schema (Contact)

**Action:**

- [ ] Paste this exact prompt in Cursor: **"Create `tests/factories/contact.ts` from `src/shared/Contact.ts` and `src/pages/ContactsPage.tsx` validation rules. Export `buildContact(overrides?)` with defaults that satisfy required fields: `name`, `email`, plus optional `phone`, `company`."**
- [ ] Confirm the factory reflects codebase rules (name/email required, email format-valid default).
- [ ] Do not add tests for this factory now; this step is to prove schema-informed factory generation from source.

**Deliverable:** Team demonstrates factory creation from schema + validation code, not manual guesswork.

---

## 1:10–1:15 — One End-to-End Scenario + Recap

Goal: One E2E test that **everyone** writes the same way: seed one task via API → open Tasks in UI → verify → toggle complete → assert. Then recap.

### Step 1 — Add E2E test (exact same flow for everyone)

**Action:**

- [ ] Paste this exact prompt in Cursor: **"Add one E2E test in `tests/tasks.spec.ts`: seed one task via API with title exactly `'E2E task'`, open UI and go to Tasks using `TasksPageObject`, verify `taskRowByTitle('E2E task')` is visible, click `taskCheckboxByTitle('E2E task')`, then assert that row has class containing `'completed'`. Use an API request context and dispose it in the test."**
- [ ] Confirm the test uses exactly the title **'E2E task'** and file **tests/tasks.spec.ts**. Run **`npx playwright test tests/tasks.spec.ts`** until all pass.

**Deliverable:** Everyone has the same E2E test with the same title and same file.

### Step 2 — Change-resilience drill (source changes, tests adapt)

**Action:**

- [ ] Timebox to 3 minutes. Make one tiny source change in `src/pages/TasksPage.tsx` (example: change add-form heading text from “Add New Task” to “Create Task”).
- [ ] Paste this exact prompt in Cursor: **"A UI label changed in `src/pages/TasksPage.tsx`. Update the Tasks Page Object and tests to restore passing behavior using source-driven locators, not brittle text-only assumptions."**
- [ ] Re-run: **`npx playwright test tests/tasks.spec.ts`**

**Deliverable:** Everyone sees tests repaired by reading code changes directly, without browser/inspector discovery.

### Step 3 — Recap (everyone hears the same takeaways)

**Action:**

- [ ] Read aloud: **Codebase as source of truth** — we used server and client code for API paths, request bodies, and locators (role/label first).
- [ ] Read aloud: **Loop** — generate tests with Cursor, run, fix from errors and code.
- [ ] Read aloud: **Layers** — API tests for speed; UI tests for critical flows; E2E for one full path; factories and seed for repeatable data.
- [ ] Read aloud: **Proof point** — we completed blind discovery, schema-derived contracts/factories, and a change-resilience drill without Swagger or inspector.

**Deliverable:** One E2E test plus the same mental model for everyone.

---

# 1:15–1:30 — Live Q&A

## 1:15–1:20 — Unblockers

- **Install:** Node LTS, `npm install`, `npx playwright install`
- **Ports:** UI 5173, API 3002; change in vite.config and server if needed
- **Playwright browsers:** `npx playwright install` or `--with-deps` on Linux
- **Run:** `npx playwright test` (all), `npx playwright test tests/smoke.spec.ts` (one file)

## 1:20–1:25 — Workflow & maintainability

- **Prompts:** Be specific (file paths, entity names, selectors from our repo); ask for one change at a time when fixing.
- **Reviewing AI output:** Run tests immediately; use real selectors from the codebase; prefer role/label over fragile class or index.
- **Stability:** Use constructor locator fields in Page Objects and typed factories/helpers; avoid raw selectors in multiple specs.

## 1:25–1:30 — Advanced / bonus

- **CI:** GitHub Actions job: install deps, start UI + API, run `npx playwright test`.
- **Scale:** More Page Objects (Contacts, Products); shared fixtures for seeded data.
- **Strategy:** Prefer API tests for CRUD and validation; UI for critical user paths; E2E for one full journey.

---

## Bonus (after the workshop)

- [ ] Add a second Page Object (e.g. `ContactsPage.ts`) and a test that adds a contact.
- [ ] Add a negative UI test (e.g. submit contact form with invalid email and assert error message in `ContactsPage`).
- [ ] Add an API contract-style assertion (e.g. expect response to match a minimal schema: `id`, `title` for tasks).
- [ ] Add a GitHub Actions workflow that runs `npx playwright test` on PRs (start UI and API as services or background steps).

---

## File reference (this repo)

| Purpose | Path |
|--------|------|
| API server entry | `src/server/index.ts` |
| Remult API + entities | `src/server/api.ts` |
| Entities | `src/shared/Task.ts`, `Contact.ts`, `Product.ts` |
| App shell + nav | `src/App.tsx` |
| Pages | `src/pages/TasksPage.tsx`, `ContactsPage.tsx`, `ProductsPage.tsx` |
| Vite proxy | `vite.config.ts` (`/api` → localhost:3002) |
| UI base | http://localhost:5173 |
| API base | http://localhost:3002 |
| Remult REST | GET/POST `/api/tasks`, `/api/contacts`, `/api/products`; GET/PUT/DELETE with `/:id` |
