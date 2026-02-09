# Test Targets

Use this list during the workshop to decide what to automate. Derived from the codebase (see WORKSHOP-WALKTHROUGH.md).

## API (base URL: http://localhost:3002)

- **GET /api/tasks**, **POST /api/tasks** — happy path + empty/invalid payload
- **GET /api/contacts**, **POST /api/contacts** — happy path + validation (e.g. missing name/email, bad email format)
- **GET /api/products** — list (products are seeded in `src/server/api.ts`)

## UI (base URL: http://localhost:5173)

- **Smoke:** App loads, nav visible (Tasks | Contacts | Products)
- **Tasks:** Add task → appears in list; filter All/Active/Completed; toggle complete; edit; delete
- **Contacts:** Add contact (required name/email); search; edit; delete (confirm dialog)

## Risks to cover

- **API:** POST with missing required fields or invalid types
- **UI:** Form validation messages (Contacts); empty states; filter and count updates
