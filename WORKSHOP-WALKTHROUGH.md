# Workshop: “Your Codebase Is About to Become Your Most Powerful Teammate”

upd**This is the live runbook.** Use it during the session; pre-workshop setup (Node, Cursor, clone, run app, install Playwright) is in [WORKSHOP-SETUP.md](./WORKSHOP-SETUP.md).

**Duration:** 90 minutes (75 min build + 15 min Q&A)  
**Format:** 100% live (builders + watchers welcome)  
**Outcome by minute 75:** Playwright UI + API tests, a Page Object, and a data factory/seed helper.

---

## 0:00–0:05 — Kickoff + Definition of Done

### Facilitator checklist

- [ ] Welcome + state today’s goal: **codebase-first testing** with Playwright and Cursor.
- [ ] **Builders:** Confirm UI and API run locally (see [WORKSHOP-SETUP.md](./WORKSHOP-SETUP.md)). **Watchers:** Follow along; you can copy the repo and run tests afterward.
- [ ] **Success criteria** (what everyone leaves with):
  - One passing Playwright **smoke test** (app reachable).
  - One **UI test** that uses a **Page Object** (e.g. add task or open a tab).
  - At least **two API tests** (one happy path, one validation/negative).
  - A **data factory** + **seed helper** used by at least one test.
  - One **end-to-end** scenario: seed via API → verify in UI → action → assert.
- [ ] **Repo structure (30 seconds):**
  - **Client:** `src/App.tsx`, `src/pages/*.tsx`, `src/main.tsx` — Vite dev server at **http://localhost:5173** (proxies `/api` to the API).
  - **Server:** `src/server/index.ts` (Express), `src/server/api.ts` (Remult + entities) — API at **http://localhost:3002**.
  - **Shared:** `src/shared/Task.ts`, `Contact.ts`, `Product.ts` — entity definitions and validation surface.

**Deliverable:** Everyone knows the end state and where client vs server code lives.

---

## 0:05–0:15 — Codebase-First Orientation (Repo as Source of Truth)

Goal: Identify **where the API starts**, **where validation lives**, and **1–2 UI flows** to automate. Produce a short “Test Targets” list.

### Step 1 — Where the API starts and routes are registered

**Prompt to use in Cursor (or say aloud):**

> “In this repo, where does the API server start and where are API routes registered? List the exact file paths and the port.”

**Expected answer / what to show:**

- **Entry:** `src/server/index.ts` — creates Express app, mounts the API, listens on port **3002**.
- **Routes:** `src/server/api.ts` — `remultExpress({ entities: [Task, Contact, Product] })`. Remult auto-exposes REST:
  - `GET/POST /api/tasks`, `GET/PUT/DELETE /api/tasks/:id`
  - `GET/POST /api/contacts`, `GET/PUT/DELETE /api/contacts/:id`
  - `GET/POST /api/products`, `GET/PUT/DELETE /api/products/:id`

### Step 2 — Where data models and validation live (what can fail and why)

**Prompt:**

> “Where are the data models for Task, Contact, and Product defined? What fields are required or have constraints that could make API or form submission fail?”

**Expected / show:**

- **Files:** `src/shared/Task.ts`, `src/shared/Contact.ts`, `src/shared/Product.ts`.
- **Task:** `title`, `description`, `priority` (low|medium|high). No Remult validators in this repo; **UI** doesn’t submit empty title (form checks).
- **Contact:** `name`, `email`, `phone`, `company`. **UI** validates: name and email required; email format regex in `ContactsPage.tsx` (~line 33).
- **Product:** `name`, `description`, `price`, `category`, `inStock`. Products are seeded in `api.ts`; no client-side validation in ProductsPage.

**Takeaway:** Validation for contacts is in the **client** (ContactsPage); API accepts what’s sent. Negative tests can send invalid payloads to the API to see how the server responds.

### Step 3 — Identify 1–2 UI flows worth automating

**Prompt:**

> “List the main user-facing flows on the Tasks and Contacts pages that would be good candidates for UI automation (e.g. add item, filter, edit, delete). Mention the page file and the main elements (buttons, inputs) by label or id if present.”

**Expected / show:**

1. **Tasks (`src/pages/TasksPage.tsx`):** Add task (form with “Title”, “Priority”, “Description”; submit “Add Task”), filter (All / Active / Completed), toggle complete (checkbox), Edit, Delete.
2. **Contacts (`src/pages/ContactsPage.tsx`):** Add contact (form: Name, Email, Phone, Company; “Add Contact” / “Update Contact”), search, Edit, Delete (with confirm dialog).

### Step 4 — Create a “Test Targets” list

**Action:** Use the list in the repo so the group has a single reference for the rest of the workshop.

- [ ] Open **`docs/test-targets.md`** (already in the repo). Walk through each section: API endpoints, UI flows, risks.
- [ ] Optionally add one or two items as the group suggests (e.g. “delete contact with confirm”).

**Deliverable:** Everyone aligned on what we’ll test and why (endpoints, UI actions, risks).

---

## 0:15–0:30 — Playwright Bootstrap + First Passing Test

Goal: Add **config** and **folder layout**, then write **one smoke test** that proves the app is reachable. Demonstrate generate → run → fix with Cursor.

**Prerequisite:** Playwright and browsers should already be installed (see [WORKSHOP-SETUP.md](./WORKSHOP-SETUP.md) section 5). If anyone skipped that, have them run: `npm install -D @playwright/test@latest` and `npx playwright install` now.

### Step 1 — Confirm Playwright + create test folder

**Commands (from project root):**

```bash
mkdir -p tests
npx playwright --version
```

**Expected:** Playwright version prints (e.g. `1.49.0`). If not, point to setup doc section 5.

### Step 2 — Playwright config

**Prompt:**

> “Add a Playwright config file for this project: TypeScript, project root is the repo root, test directory is `tests`, use a baseURL of http://localhost:5173 for the UI. Config file should be playwright.config.ts in the project root.”

**Expected file:** `playwright.config.ts` (root) with something like:

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
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
```

**If baseURL is missing or wrong:** Ask Cursor to “set baseURL to http://localhost:5173 in playwright.config.ts”.

### Step 3 — First smoke test

**Prompt:**

> “In the tests folder, create a smoke test file that: 1) goes to the baseURL (path '/'), 2) expects the page to have the text 'QA Workshop' (the nav brand), and 3) expects to see the navigation buttons Tasks, Contacts, Products. Use the role or text that matches the real UI. File name: tests/smoke.spec.ts.”

**Expected file:** `tests/smoke.spec.ts` (or similar), e.g.:

```ts
import { test, expect } from '@playwright/test';

test('app loads and nav is visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /QA Workshop/i }).or(
    page.getByText('QA Workshop')
  )).toBeVisible();
  await expect(page.getByRole('button', { name: 'Tasks' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Contacts' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Products' })).toBeVisible();
});
```

**Note:** Nav brand in the repo is a `<div className="nav-brand">QA Workshop</div>`, so it may be found by text. If the generated test uses a heading, adjust: the app has “QA Workshop” in the navbar and “Tasks” / “Contacts” / “Products” as buttons.

### Step 4 — Run and fix (augmented loop)

**Commands:**

```bash
# Ensure UI is running: npm run dev (Terminal A) and npm run dev-node (Terminal B)
npx playwright test tests/smoke.spec.ts
```

**If it fails:**

- **Timeout / page not loading:** Confirm UI is at http://localhost:5173 and API at 3002; `baseURL` in config is correct.
- **Selector not found:** Open `src/App.tsx` and point out: nav brand is `<div className="nav-brand">QA Workshop</div>`, links are `<button>Tasks</button>`, etc. Prompt: “Update the smoke test to use getByText('QA Workshop') and getByRole('button', { name: 'Tasks' }) to match App.tsx.”

**Deliverable:** One passing Playwright test (`npx playwright test tests/smoke.spec.ts`).

---

## 0:30–0:45 — Locators Without Opening a Browser + First Page Object

Goal: Derive locators from React and accessibility (role/label first); create a Page Object and a UI test; **then** add `data-testid` to the app and **update the POM** to use them (illustrate the augmented loop: codebase change → POM update).

### Step 1 — Derive locators from the codebase

**Prompt:**

> “Look at src/App.tsx and src/pages/TasksPage.tsx. List the best selectors for: (1) the Tasks nav button, (2) the 'Add New Task' form title, (3) the task title input, (4) the priority dropdown, (5) the Add Task submit button, (6) the first task row's checkbox. Prefer role and label (aria-label or associated label). Only suggest data-testid if there's no good role/label.”

**Expected / show:**

- **Tasks nav:** `getByRole('button', { name: 'Tasks' })` — from App.tsx.
- **Form title:** `getByRole('heading', { name: 'Add New Task' })` — TasksPage has `<h3>Add New Task</h3>`.
- **Task title input:** `getByLabel('Title')` or `getByRole('textbox', { name: 'Title' })` — `<label htmlFor="task-title">Title</label>` and `id="task-title"`.
- **Priority:** `getByLabel('Priority')` or `getByRole('combobox', { name: 'Priority' })` — `id="task-priority"`.
- **Add Task button:** `getByRole('button', { name: 'Add Task' })`.
- **Task list / checkbox:** For the list we can use `.locator('.task-item')` (class from the code); for a specific row or checkbox we might add `data-testid` later for stability.

### Step 2 — Create the first Page Object (role/label only, no testids yet)

**Prompt:**

> “Create a Page Object for the Tasks page. File: tests/pages/TasksPage.ts. It should: (1) take a Playwright Page in the constructor, (2) have goto() that goes to '/' and clicks the Tasks nav button, (3) have addTask(title, description?, priority?), getTaskItems(), getFirstTaskCheckbox(). Use only role and label selectors from the app: getByLabel('Title'), getByLabel('Description'), getByLabel('Priority'), getByRole('button', { name: 'Add Task' }). For the task list use .locator('.task-item') since we don't have data-testid yet. Match src/pages/TasksPage.tsx.”

**Expected (conceptual):**

```ts
// tests/pages/TasksPage.ts
import type { Page } from '@playwright/test';

export class TasksPageObject {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/');
    await this.page.getByRole('button', { name: 'Tasks' }).click();
  }

  async addTask(title: string, description = '', priority: 'low' | 'medium' | 'high' = 'medium') {
    await this.page.getByLabel('Title').fill(title);
    if (description) await this.page.getByLabel('Description').fill(description);
    await this.page.getByLabel('Priority').selectOption(priority);
    await this.page.getByRole('button', { name: 'Add Task' }).click();
  }

  getTaskItems() {
    return this.page.locator('.task-item');
  }

  getFirstTaskCheckbox() {
    return this.page.getByRole('checkbox').first();
  }
}
```

### Step 3 — UI test using the Page Object

**Prompt:**

> “Add a test in tests/tasks.spec.ts that: uses the TasksPage Page Object, calls goto(), then addTask('Workshop task', 'From Playwright', 'high'), then expects at least one task row to be visible and to contain the text 'Workshop task'. Use the same tests folder and playwright config.”

**Expected:** `tests/tasks.spec.ts` that imports the page object, uses it, and asserts on “Workshop task”. Run:

```bash
npx playwright test tests/tasks.spec.ts
```

Confirm it passes. **Talking point:** The POM works with role/label and one class-based locator. Next we’ll add testids to the app and refactor the POM to use them.

### Step 4 — Add data-testid to the app (AI updates source)

**Prompt:**

> “In src/pages/TasksPage.tsx add data-testid attributes so tests can target key elements reliably: (1) data-testid='task-item' on the outer div of each task row (the div with className task-item), (2) data-testid='add-task-form' on the Add New Task form element. Keep all existing labels and ids.”

**Expected changes:**

- In the task list `.map`, the outer `<div key={task.id} className={\`task-item ...\`}>` gets `data-testid="task-item"`.
- The `<form className="form-card" onSubmit={addTask}>` that contains “Add New Task” gets `data-testid="add-task-form"`.

**Talking point:** We’re changing the **product** code so tests have stable hooks. The AI can add testids in one go; we only add them where we need them (list items, form), not everywhere.

### Step 5 — Update the POM to use the new testids (AI updates tests)

**Prompt:**

> “Update tests/pages/TasksPage.ts to use the data-testid we added: (1) getTaskItems() should use getByTestId('task-item') instead of .locator('.task-item'). (2) Add a method getAddTaskForm() that returns the form using getByTestId('add-task-form'). Keep all other selectors (role/label) as they are.”

**Expected (conceptual):**

```ts
getTaskItems() {
  return this.page.getByTestId('task-item');
}

getAddTaskForm() {
  return this.page.getByTestId('add-task-form');
}
```

Run the tests again:

```bash
npx playwright test tests/tasks.spec.ts
```

**Deliverable:** Page Object + UI test; then **app has testids** and **POM is updated** to use them — illustrating that the system can both add testids and update the POM.

---

## 0:45–1:00 — API Tests Without Swagger/Postman

Goal: Use the server code to know request/response shape; add Playwright API tests (request context); one happy-path and one negative/validation test.

### Step 1 — Discover request/response shape from server code

**Prompt:**

> “For the Remult API in this repo: what is the exact JSON body to POST a new task to /api/tasks and what does the API return? Same for POST /api/contacts. Use src/shared/Task.ts and Contact.ts and the Remult docs if needed.”

**Expected:**

- **POST /api/tasks**  
  Body: `{ "title": "string", "description": "string", "completed": boolean?, "priority": "low"|"medium"|"high" }`.  
  Returns: created entity (with `id`, `createdAt`, etc.).
- **POST /api/contacts**  
  Body: `{ "name", "email", "phone", "company" }`.  
  Returns: created contact with `id`.  
  (Validation: client-side only in this app; API may still accept invalid data — we can test that.)

### Step 2 — Playwright API test file and base URL for API

**Prompt:**

> “Create tests/api/tasks.api.spec.ts. Use Playwright's request context (request fixture or request.newContext) to call the API at base URL http://localhost:3002. Write two tests: (1) happy path: POST /api/tasks with valid body { title: 'API task', description: 'From API test', priority: 'high' }, expect status 201 and response body to have id and title 'API task'. (2) negative: POST /api/tasks with empty title { title: '', description: 'x', priority: 'medium' }, and assert that the response status is not 2xx (e.g. 400 or 422) or that the response indicates an error. Use the actual Remult API base URL and path /api/tasks.”

**Expected (conceptual):**

```ts
// tests/api/tasks.api.spec.ts
import { test, expect } from '@playwright/test';

const API_BASE = 'http://localhost:3002';

test('POST /api/tasks - happy path', async ({ request }) => {
  const res = await request.post(`${API_BASE}/api/tasks`, {
    data: { title: 'API task', description: 'From API test', priority: 'high' },
  });
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body).toHaveProperty('id');
  expect(body.title).toBe('API task');
});

test('POST /api/tasks - empty title rejected or error', async ({ request }) => {
  const res = await request.post(`${API_BASE}/api/tasks`, {
    data: { title: '', description: 'x', priority: 'medium' },
  });
  // Remult may return 201 with empty title; if so, change assertion to match real behavior
  expect(res.status()).not.toBe(201);
  // or: const body = await res.json(); expect(body.error or status).toBeDefined();
});
```

**Note:** If Remult actually allows empty title, adjust the negative test to something the server does reject (e.g. invalid type or a field that Remult validates). Optionally add a contact validation test: POST with invalid email and assert non-2xx or error message.

### Step 3 — Run API tests

**Command:**

```bash
npx playwright test tests/api/
```

Ensure API server is running (`npm run dev-node`). If tests are not in a separate project, they might pick up `baseURL`; API tests should use `http://localhost:3002` explicitly.

**Deliverable:** At least two API tests under `tests/api/` (one happy path, one negative/validation).

---

## 1:00–1:10 — Data Factories + Seeding Helpers

Goal: One factory with valid defaults and overrides; one seed helper that creates N records via the API; use them in at least one test.

### Step 1 — Data factory

**Prompt:**

> “Create a test data factory for Task and Contact. File: tests/factories/task.ts (and contact.ts if you want). For Task: default values title 'Test Task', description '', priority 'medium'. For Contact: name 'Test User', email 'test@example.com', phone '', company 'Acme'. Export a function that accepts partial overrides and returns the full object. Use the same field names and types as in src/shared/Task.ts and Contact.ts.”

**Expected (conceptual):**

```ts
// tests/factories/task.ts
import type { Task } from '../../src/shared/Task';

export function buildTask(overrides: Partial<Pick<Task, 'title' | 'description' | 'priority'>> = {}): { title: string; description: string; priority: string } {
  return {
    title: 'Test Task',
    description: '',
    priority: 'medium',
    ...overrides,
  };
}
```

(Contact factory similar: `buildContact(overrides)` with name, email, phone, company.)

### Step 2 — Seeding helper (create N via API)

**Prompt:**

> “Create a seed helper tests/helpers/seed.ts that: (1) takes a Playwright APIRequestContext (or fetch), base URL http://localhost:3002, and (2) has a function seedTasks(count: number, overrides?: partial task) that POSTs to /api/tasks count times using the task factory and returns the created tasks (or their ids). Use the task factory we created so tests are readable and repeatable.”

**Expected (conceptual):**

```ts
// tests/helpers/seed.ts
import { request } from '@playwright/test';
import { buildTask } from '../factories/task';

const API_BASE = 'http://localhost:3002';

export async function seedTasks(
  requestContext: { post: (url: string, opts: { data: unknown }) => Promise<{ ok: () => boolean; json: () => Promise<{ id: number }> }> },
  count: number,
  overrides?: Partial<ReturnType<typeof buildTask>>
) {
  const created: { id: number }[] = [];
  for (let i = 0; i < count; i++) {
    const body = buildTask(overrides ?? { title: `Seed task ${i + 1}` });
    const res = await requestContext.post(`${API_BASE}/api/tasks`, { data: body });
    if (res.ok()) created.push(await res.json());
  }
  return created;
}
```

(Adjust to match your factory and request API; e.g. use the `request` fixture in the test and pass it in.)

### Step 3 — Use in a test

**Prompt:**

> “In tests/tasks.spec.ts (or a new test file), add a test that: uses the seed helper to create 3 tasks via the API, then opens the Tasks page in the browser, and expects to see at least 3 task rows (or expects one of the seeded task titles). Use the TasksPage Page Object and the seed helper.”

**Deliverable:** Factory + seed helper used by at least one test; tests readable and repeatable.

---

## 1:10–1:15 — One End-to-End Scenario + Recap

Goal: One E2E test: seed via API → verify in UI → perform action → assert. Recap the workflow.

### E2E test

**Prompt:**

> “Add one end-to-end test: (1) seed a single task via the API with a unique title like 'E2E task <timestamp>', (2) open the UI and go to Tasks, (3) verify the task appears in the list, (4) toggle its checkbox to complete, (5) assert that the task row has a completed state or that the 'remaining' count decreased. Use the request fixture for seeding and the Tasks page object for UI. File: tests/e2e/task-flow.spec.ts or in tests/tasks.spec.ts.”

**Expected flow:** Seed → goto Tasks → assert text visible → click first checkbox (or the one matching the title) → assert completed state or badge count.

### Recap (talking points)

- **Codebase as source of truth:** We used server and client code to decide API paths, request bodies, and locators (role/label first).
- **Loop:** Generate tests with Cursor → run → fix from errors and code.
- **Layers:** API tests for speed and stability; UI tests for critical flows; E2E for one full path; factories and seed for repeatable data.

**Deliverable:** One E2E test plus a clear mental model to reuse at work.

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
- **Stability:** Page Objects and factories isolate changes; avoid raw selectors in multiple specs.

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
