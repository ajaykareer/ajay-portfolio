# Save portfolio updates to GitHub

Run these commands from your portfolio folder after connecting it to your chosen GitHub repository.

## Each time you update the site

1. Make your changes in VS Code and preview them with `npm run dev`.
2. Review the files you changed:

   ```bash
   git status
   git diff
   ```

3. Save a commit and upload it:

   ```bash
   git add .
   git commit -m "Update portfolio projects and content"
   git push
   ```

Use a short commit message that describes what you changed. Dependencies, generated build output, local caches, and `.env` files are already excluded by `.gitignore`.

## In VS Code

Open **Source Control** (`Ctrl + Shift + G`), review your changes, stage the files with **+**, write a commit message, and choose **Commit**. Then choose **Sync Changes** or **Push**.

## When working from another computer

Clone your GitHub repository, open its folder, then run:

```bash
npm ci
npm run dev
```

Before starting new work in an existing clone, use `git pull --ff-only` to bring in remote changes. If Git reports a conflict or rejects a push, resolve the difference rather than using a force push.

GitHub backs up the source. Updating the live website is a separate deployment step.
