How to push local changes to GitHub (safe helper)

What this repository helper does
- Ensures `server/.env` is listed in `.gitignore` and removed from the git index if it was tracked (so you don't accidentally push secrets).
- Stages all local changes, commits with a helpful message, sets the `origin` remote if missing, and pushes the current branch.

Run the provided script from PowerShell:
1. Open PowerShell (not elevated) and change to the project folder:
   cd /d D:\Durgesh\wise-global\wise-global
2. Run the script:
   .\push_to_github.ps1

Authentication notes
- For HTTPS pushes, Git will prompt for username and password. Use a GitHub Personal Access Token (PAT) as the password (recommended).
- For SSH pushes, configure SSH keys and change the remote to the SSH URL:
  git remote set-url origin git@github.com:Durgesh122/Wise_globle_research.git

If you need me to create a "patch" file or a zip of the modified files instead so you can inspect before pushing, tell me and I'll prepare it.
