# Publishing this project as your workshop fork

## 1. Create the new repo on GitHub

1. Go to [GitHub](https://github.com/new) (or your Git host).
2. Create a **new repository** (e.g. `qa-augmented-workshop`).
3. **Do not** add a README, .gitignore, or license (you already have a project).
4. Copy the new repo URL (e.g. `https://github.com/YOUR_USERNAME/qa-augmented-workshop.git`).

## 2. Commit your workshop changes

From the project root:

```bash
git add .
git status   # review what will be committed
git commit -m "Workshop setup: SQLite, Counter entity, persisted counter UI, WORKSHOP-SETUP.md"
```

## 3. Add your new repo and push

**Option A — Use your fork as the main remote (recommended)**

Replace `YOUR_USERNAME` and repo name with your actual URL:

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/qa-augmented-workshop.git
git push -u origin master
```

To keep a reference to the original Remult starter:

```bash
git remote add upstream https://github.com/remult/react-vite-express-starter.git
```

**Option B — Keep origin as the original, add your fork**

```bash
git remote add workshop https://github.com/YOUR_USERNAME/qa-augmented-workshop.git
git push -u workshop master
```

## 4. Update WORKSHOP-SETUP.md for attendees

After the repo is live, edit **WORKSHOP-SETUP.md** Section 3 so attendees clone **your** repo instead of the stock starter:

- Replace the clone URL with your repo URL.
- In Section 4, add a note at the top: **“If you cloned the workshop repo, the database and Counter are already set up; skip to Section 5.”**

Then commit and push that doc change.

## 5. Share with attendees

Give them:

- The clone URL: `https://github.com/YOUR_USERNAME/qa-augmented-workshop.git`
- Instructions: clone → `cd qa-augmented-workshop` → `npm install` → follow WORKSHOP-SETUP from Section 5 (run app) and Section 6 (Playwright).
