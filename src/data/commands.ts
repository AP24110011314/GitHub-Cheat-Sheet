export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type CategoryId =
  | "setup"
  | "creating"
  | "staging"
  | "branching"
  | "remote"
  | "undoing"
  | "stash"
  | "tags"
  | "rebase"
  | "inspecting"
  | "gh"
  | "collab";

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  /** Subtle accent color used for the category dot / badge. */
  color: string;
}

export interface GitCommand {
  id: string;
  command: string;
  description: string;
  example: string;
  category: CategoryId;
  difficulty: Difficulty;
  keywords: string[];
  /** Set for destructive commands — rendered as a "⚠ careful" note. */
  careful?: string;
}

export const CATEGORIES: Category[] = [
  { id: "setup", name: "Setup & Config", description: "Install checks, identity, aliases and defaults.", color: "#8b949e" },
  { id: "creating", name: "Creating Repos", description: "Init, clone and first push.", color: "#2f81f7" },
  { id: "staging", name: "Staging & Committing", description: "Stage hunks, diff and write commits.", color: "#3fb950" },
  { id: "branching", name: "Branching & Merging", description: "Switch, branch, merge and worktrees.", color: "#a371f7" },
  { id: "remote", name: "Remote & Syncing", description: "Fetch, pull, push and remotes.", color: "#d29922" },
  { id: "undoing", name: "Undoing Changes", description: "Restore, reset, revert and clean up.", color: "#f85149" },
  { id: "stash", name: "Stash", description: "Shelve work in progress safely.", color: "#2f81f7" },
  { id: "tags", name: "Tags", description: "Mark releases and share tags.", color: "#a371f7" },
  { id: "rebase", name: "Rebase", description: "Rewrite and replay commit history.", color: "#f85149" },
  { id: "inspecting", name: "Inspecting & Logs", description: "Log, blame, bisect and search history.", color: "#8b949e" },
  { id: "gh", name: "GitHub CLI (gh)", description: "Repos, PRs and issues from the terminal.", color: "#3fb950" },
  { id: "collab", name: "Collaboration", description: "Forks, PRs, reviews and releases.", color: "#d29922" },
];

export const COMMANDS: GitCommand[] = [
  // ── Setup & Config ──────────────────────────────────────────────
  { id: "setup-version", command: "git --version", description: "Check that Git is installed and which version you run.", example: "git --version", category: "setup", difficulty: "Beginner", keywords: ["install", "version", "check"] },
  { id: "setup-name", command: 'git config --global user.name "Your Name"', description: "Set the author name recorded on every commit you make.", example: 'git config --global user.name "Ada Lovelace"', category: "setup", difficulty: "Beginner", keywords: ["identity", "author", "config", "name"] },
  { id: "setup-email", command: 'git config --global user.email "you@example.com"', description: "Set the author email recorded on every commit you make.", example: 'git config --global user.email "ada@example.com"', category: "setup", difficulty: "Beginner", keywords: ["identity", "author", "config", "email"] },
  { id: "setup-branch", command: "git config --global init.defaultBranch main", description: "Make `git init` create a `main` branch by default.", example: "git config --global init.defaultBranch main", category: "setup", difficulty: "Beginner", keywords: ["default", "branch", "main", "init"] },
  { id: "setup-editor", command: 'git config --global core.editor "code --wait"', description: "Choose the editor Git opens for commit messages and rebases.", example: 'git config --global core.editor "code --wait"', category: "setup", difficulty: "Intermediate", keywords: ["editor", "vscode", "config"] },
  { id: "setup-pull", command: "git config --global pull.rebase false", description: "Make `git pull` merge by default instead of rebasing.", example: "git config --global pull.rebase false", category: "setup", difficulty: "Intermediate", keywords: ["pull", "merge", "rebase", "default"] },
  { id: "setup-list", command: "git config --list", description: "Show all effective config values and where they come from.", example: "git config --list --show-origin", category: "setup", difficulty: "Beginner", keywords: ["list", "show", "settings"] },
  { id: "setup-local-name", command: "git config user.name", description: "Show the repo-level name override (empty falls back to global).", example: "git config user.name", category: "setup", difficulty: "Intermediate", keywords: ["local", "override", "identity"] },
  { id: "setup-alias", command: "git config --global alias.st status", description: "Create a shortcut so `git st` runs `git status`.", example: "git config --global alias.st status", category: "setup", difficulty: "Intermediate", keywords: ["alias", "shortcut", "status"] },
  { id: "setup-color", command: "git config --global color.ui auto", description: "Enable colored output only when the terminal supports it.", example: "git config --global color.ui auto", category: "setup", difficulty: "Beginner", keywords: ["color", "output"] },
  { id: "setup-help", command: "git help log", description: "Open the full manual page for a command.", example: "git help log", category: "setup", difficulty: "Beginner", keywords: ["help", "manual", "docs"] },

  // ── Creating Repos ──────────────────────────────────────────────
  { id: "creating-init", command: "git init", description: "Turn the current folder into a new Git repository.", example: "mkdir my-app && cd my-app && git init", category: "creating", difficulty: "Beginner", keywords: ["init", "new", "create"] },
  { id: "creating-init-branch", command: "git init --initial-branch=main", description: "Init a repo with `main` as the first branch name.", example: "git init --initial-branch=main my-app", category: "creating", difficulty: "Beginner", keywords: ["init", "main", "branch"] },
  { id: "creating-clone", command: "git clone https://github.com/owner/repo.git", description: "Download a full copy of a remote repository.", example: "git clone https://github.com/octocat/Hello-World.git", category: "creating", difficulty: "Beginner", keywords: ["clone", "download", "copy"] },
  { id: "creating-clone-shallow", command: "git clone --depth 1 https://github.com/owner/repo.git", description: "Clone only the latest snapshot for a faster download.", example: "git clone --depth 1 https://github.com/octocat/Hello-World.git", category: "creating", difficulty: "Intermediate", keywords: ["shallow", "depth", "fast", "clone"] },
  { id: "creating-clone-branch", command: "git clone --branch develop https://github.com/owner/repo.git", description: "Clone and check out one specific branch.", example: "git clone --branch develop https://github.com/octocat/Hello-World.git", category: "creating", difficulty: "Intermediate", keywords: ["branch", "clone", "checkout"] },
  { id: "creating-gh-create", command: "gh repo create my-app --public --clone", description: "Create a GitHub repo and clone it locally in one step.", example: "gh repo create my-app --public --clone", category: "creating", difficulty: "Intermediate", keywords: ["gh", "github", "create", "clone"] },
  { id: "creating-gh-clone", command: "gh repo clone owner/repo", description: "Clone a GitHub repo using shorthand instead of a full URL.", example: "gh repo clone octocat/Hello-World", category: "creating", difficulty: "Beginner", keywords: ["gh", "clone", "github"] },
  { id: "creating-remote-add", command: "git remote add origin https://github.com/you/repo.git", description: "Link a local repo to a remote named `origin`.", example: "git remote add origin https://github.com/you/my-app.git", category: "creating", difficulty: "Beginner", keywords: ["remote", "origin", "link"] },
  { id: "creating-first-push", command: "git push -u origin main", description: "Push `main` and remember it as the upstream for future pulls.", example: "git push -u origin main", category: "creating", difficulty: "Beginner", keywords: ["push", "upstream", "first", "origin"] },
  { id: "creating-submodule", command: "git submodule add https://github.com/owner/lib.git vendor/lib", description: "Embed another repo as a subdirectory pinned to a commit.", example: "git submodule add https://github.com/owner/lib.git vendor/lib", category: "creating", difficulty: "Advanced", keywords: ["submodule", "nested", "dependency"] },

  // ── Staging & Committing ────────────────────────────────────────
  { id: "staging-status", command: "git status", description: "Show staged, unstaged and untracked changes.", example: "git status", category: "staging", difficulty: "Beginner", keywords: ["status", "state", "changes"] },
  { id: "staging-status-short", command: "git status --short", description: "Compact two-column status, handy in scripts and aliases.", example: "git status --short", category: "staging", difficulty: "Intermediate", keywords: ["status", "short", "porcelain"] },
  { id: "staging-add-file", command: "git add index.html", description: "Stage one file for the next commit.", example: "git add index.html", category: "staging", difficulty: "Beginner", keywords: ["add", "stage"] },
  { id: "staging-add-all", command: "git add .", description: "Stage all changes under the current directory.", example: "git add .", category: "staging", difficulty: "Beginner", keywords: ["add", "all", "stage"] },
  { id: "staging-add-patch", command: "git add -p", description: "Interactively stage parts (hunks) of files instead of everything.", example: "git add -p", category: "staging", difficulty: "Intermediate", keywords: ["patch", "hunk", "interactive", "partial"] },
  { id: "staging-diff", command: "git diff", description: "Show unstaged changes line by line.", example: "git diff", category: "staging", difficulty: "Beginner", keywords: ["diff", "changes", "unstaged"] },
  { id: "staging-diff-staged", command: "git diff --staged", description: "Show staged changes — exactly what the next commit contains.", example: "git diff --staged", category: "staging", difficulty: "Intermediate", keywords: ["diff", "staged", "cached", "review"] },
  { id: "staging-commit", command: 'git commit -m "Add login form"', description: "Record staged changes with a short message.", example: 'git commit -m "Add login form"', category: "staging", difficulty: "Beginner", keywords: ["commit", "message", "snapshot"] },
  { id: "staging-commit-all", command: 'git commit -a -m "Fix typo in header"', description: "Stage tracked-file edits and commit in one step.", example: 'git commit -a -m "Fix typo in header"', category: "staging", difficulty: "Intermediate", keywords: ["commit", "all", "tracked"] },
  { id: "staging-amend", command: 'git commit --amend -m "Add login form with validation"', description: "Fold staged changes into the last commit with a new message.", example: "git add forgotten.js && git commit --amend", category: "staging", difficulty: "Intermediate", keywords: ["amend", "fix", "rewrite"] },
  { id: "staging-amend-noedit", command: "git commit --amend --no-edit", description: "Add staged files to the last commit without changing its message.", example: "git add forgotten.js && git commit --amend --no-edit", category: "staging", difficulty: "Intermediate", keywords: ["amend", "no-edit", "fix"] },
  { id: "staging-unstage", command: "git restore --staged index.html", description: "Unstage a file but keep its working-tree edits.", example: "git restore --staged index.html", category: "staging", difficulty: "Beginner", keywords: ["unstage", "restore", "staged"] },

  // ── Branching & Merging ─────────────────────────────────────────
  { id: "branching-list", command: "git branch", description: "List local branches; the current one is marked with `*`.", example: "git branch", category: "branching", difficulty: "Beginner", keywords: ["branch", "list"] },
  { id: "branching-list-all", command: "git branch -a", description: "List local and remote-tracking branches.", example: "git branch -a", category: "branching", difficulty: "Intermediate", keywords: ["branch", "all", "remote"] },
  { id: "branching-create", command: "git branch feature/login", description: "Create a branch without switching to it.", example: "git branch feature/login", category: "branching", difficulty: "Beginner", keywords: ["branch", "create"] },
  { id: "branching-delete", command: "git branch -d feature/login", description: "Delete a branch that is already merged.", example: "git branch -d feature/login", category: "branching", difficulty: "Beginner", keywords: ["branch", "delete", "merged"] },
  { id: "branching-delete-force", command: "git branch -D feature/login", description: "Force-delete a branch even if it is not merged.", example: "git branch -D experiment", category: "branching", difficulty: "Intermediate", keywords: ["branch", "delete", "force"], careful: "Discards commits unique to that branch. Merge or back it up first." },
  { id: "branching-switch", command: "git switch main", description: "Switch to an existing branch (the modern checkout).", example: "git switch main", category: "branching", difficulty: "Beginner", keywords: ["switch", "checkout", "branch"] },
  { id: "branching-switch-new", command: "git switch -c feature/login", description: "Create and switch to a new branch in one step.", example: "git switch -c feature/login", category: "branching", difficulty: "Beginner", keywords: ["switch", "create", "branch"] },
  { id: "branching-prev", command: "git switch -", description: "Jump back to the previously checked-out branch.", example: "git switch -", category: "branching", difficulty: "Intermediate", keywords: ["switch", "previous", "toggle"] },
  { id: "branching-checkout-b", command: "git checkout -b feature/login", description: "Classic way to create and switch to a branch.", example: "git checkout -b feature/login", category: "branching", difficulty: "Beginner", keywords: ["checkout", "branch", "create"] },
  { id: "branching-merge", command: "git merge feature/login", description: "Merge a branch into the current one.", example: "git switch main && git merge feature/login", category: "branching", difficulty: "Beginner", keywords: ["merge", "combine"] },
  { id: "branching-merge-noff", command: "git merge --no-ff feature/login", description: "Always create a merge commit to preserve branch history.", example: "git merge --no-ff feature/login", category: "branching", difficulty: "Intermediate", keywords: ["merge", "no-ff", "history"] },
  { id: "branching-merge-abort", command: "git merge --abort", description: "Cancel a conflicted merge and restore the pre-merge state.", example: "git merge --abort", category: "branching", difficulty: "Intermediate", keywords: ["merge", "abort", "conflict", "cancel"] },
  { id: "branching-worktree", command: "git worktree add ../hotfix -b hotfix", description: "Check out a second branch in a separate folder simultaneously.", example: "git worktree add ../hotfix -b hotfix", category: "branching", difficulty: "Advanced", keywords: ["worktree", "parallel", "checkout"] },
  { id: "branching-worktree-list", command: "git worktree list", description: "Show all linked working trees and their branches.", example: "git worktree list", category: "branching", difficulty: "Advanced", keywords: ["worktree", "list"] },

  // ── Remote & Syncing ────────────────────────────────────────────
  { id: "remote-list", command: "git remote -v", description: "Show remote names and their fetch/push URLs.", example: "git remote -v", category: "remote", difficulty: "Beginner", keywords: ["remote", "origin", "url", "list"] },
  { id: "remote-add-upstream", command: "git remote add upstream https://github.com/original/repo.git", description: "Track the original repo when you work from a fork.", example: "git remote add upstream https://github.com/original/repo.git", category: "remote", difficulty: "Intermediate", keywords: ["fork", "upstream", "remote"] },
  { id: "remote-fetch", command: "git fetch origin", description: "Download remote changes without touching your files.", example: "git fetch origin", category: "remote", difficulty: "Beginner", keywords: ["fetch", "download", "safe"] },
  { id: "remote-fetch-upstream", command: "git fetch upstream", description: "Download changes from the original repo of a fork.", example: "git fetch upstream", category: "remote", difficulty: "Intermediate", keywords: ["fetch", "fork", "upstream"] },
  { id: "remote-pull", command: "git pull", description: "Fetch the upstream branch and merge it into the current one.", example: "git pull", category: "remote", difficulty: "Beginner", keywords: ["pull", "fetch", "merge", "sync"] },
  { id: "remote-pull-rebase", command: "git pull --rebase", description: "Fetch and replay your local commits on top — a linear history.", example: "git pull --rebase", category: "remote", difficulty: "Intermediate", keywords: ["pull", "rebase", "linear"] },
  { id: "remote-push", command: "git push", description: "Upload committed changes to the tracked upstream branch.", example: "git push", category: "remote", difficulty: "Beginner", keywords: ["push", "upload", "sync"] },
  { id: "remote-push-set", command: "git push -u origin feature/login", description: "Push a new branch and track it for future `pull`/`push`.", example: "git push -u origin feature/login", category: "remote", difficulty: "Beginner", keywords: ["push", "upstream", "track", "branch"] },
  { id: "remote-push-lease", command: "git push --force-with-lease", description: "Overwrite the remote branch only if nobody else pushed since.", example: "git push --force-with-lease", category: "remote", difficulty: "Advanced", keywords: ["push", "force", "rewrite"], careful: "Rewrites shared history. Prefer over --force, and only on branches you own." },
  { id: "remote-delete-branch", command: "git push --delete origin old-branch", description: "Delete a branch from the remote repository.", example: "git push --delete origin old-branch", category: "remote", difficulty: "Intermediate", keywords: ["delete", "remote", "branch"], careful: "Removes the remote branch for everyone. Make sure it is merged." },
  { id: "remote-ls", command: "git ls-remote origin", description: "List remote branches and tags without downloading anything.", example: "git ls-remote origin", category: "remote", difficulty: "Advanced", keywords: ["list", "remote", "refs"] },
  { id: "remote-prune", command: "git remote prune origin", description: "Remove local references to branches deleted on the remote.", example: "git remote prune origin", category: "remote", difficulty: "Intermediate", keywords: ["prune", "cleanup", "stale"] },
  { id: "remote-remove", command: "git remote remove upstream", description: "Stop tracking a remote (e.g. a former fork source).", example: "git remote remove upstream", category: "remote", difficulty: "Intermediate", keywords: ["remove", "remote", "upstream"] },

  // ── Undoing Changes ─────────────────────────────────────────────
  { id: "undo-restore", command: "git restore index.html", description: "Discard unstaged edits to a file (back to last commit).", example: "git restore index.html", category: "undoing", difficulty: "Beginner", keywords: ["restore", "discard", "revert", "file"], careful: "Discards uncommitted work in that file permanently." },
  { id: "undo-restore-source", command: "git restore --source=HEAD~1 index.html", description: "Restore a file from an older commit without switching branches.", example: "git restore --source=HEAD~1 index.html", category: "undoing", difficulty: "Advanced", keywords: ["restore", "source", "history"] },
  { id: "undo-checkout-file", command: "git checkout HEAD -- index.html", description: "Classic way to discard edits to a file.", example: "git checkout HEAD -- index.html", category: "undoing", difficulty: "Intermediate", keywords: ["checkout", "discard", "restore"], careful: "Discards uncommitted work in that file permanently." },
  { id: "undo-reset-soft", command: "git reset --soft HEAD~1", description: "Undo the last commit but keep all changes staged.", example: "git reset --soft HEAD~1", category: "undoing", difficulty: "Intermediate", keywords: ["reset", "soft", "undo", "commit"] },
  { id: "undo-reset-mixed", command: "git reset HEAD~1", description: "Undo the last commit and unstage its changes (files stay edited).", example: "git reset HEAD~1", category: "undoing", difficulty: "Intermediate", keywords: ["reset", "mixed", "undo", "unstage"] },
  { id: "undo-reset-hard", command: "git reset --hard HEAD~1", description: "Throw away the last commit and all working-tree changes.", example: "git reset --hard HEAD~1", category: "undoing", difficulty: "Advanced", keywords: ["reset", "hard", "discard", "undo"], careful: "Permanently deletes uncommitted changes and the commit. Stash first if unsure." },
  { id: "undo-revert", command: "git revert abc1234", description: "Safely undo a published commit by adding an inverse commit.", example: "git log --oneline && git revert abc1234", category: "undoing", difficulty: "Intermediate", keywords: ["revert", "undo", "safe", "shared"] },
  { id: "undo-revert-nocommit", command: "git revert --no-commit abc1234", description: "Stage a revert without committing, to combine several undos.", example: "git revert --no-commit abc1234 def5678 && git commit", category: "undoing", difficulty: "Advanced", keywords: ["revert", "nocommit", "stage"] },
  { id: "undo-reflog", command: "git reflog", description: "Show where HEAD recently pointed — your safety net for lost commits.", example: "git reflog", category: "undoing", difficulty: "Intermediate", keywords: ["reflog", "recover", "history", "lost"] },
  { id: "undo-clean-dry", command: "git clean -n", description: "Preview which untracked files `git clean` would delete.", example: "git clean -n", category: "undoing", difficulty: "Intermediate", keywords: ["clean", "untracked", "preview", "dry-run"] },
  { id: "undo-clean-force", command: "git clean -fd", description: "Delete untracked files and folders.", example: "git clean -n && git clean -fd", category: "undoing", difficulty: "Advanced", keywords: ["clean", "untracked", "delete"], careful: "Deletes files Git never tracked. They cannot be recovered via Git." },
  { id: "undo-reset-orig", command: "git reset --hard ORIG_HEAD", description: "Jump back to where you were before a merge or reset.", example: "git reset --hard ORIG_HEAD", category: "undoing", difficulty: "Advanced", keywords: ["reset", "orig-head", "recover"], careful: "Discards current uncommitted changes permanently." },

  // ── Stash ───────────────────────────────────────────────────────
  { id: "stash-push", command: "git stash", description: "Shelve dirty changes and restore a clean tree.", example: "git stash", category: "stash", difficulty: "Beginner", keywords: ["stash", "shelve", "wip"] },
  { id: "stash-named", command: 'git stash push -m "WIP: login validation"', description: "Stash with a label so you can find it later.", example: 'git stash push -m "WIP: login validation"', category: "stash", difficulty: "Beginner", keywords: ["stash", "message", "label"] },
  { id: "stash-untracked", command: "git stash -u", description: "Stash tracked edits plus untracked files.", example: "git stash -u", category: "stash", difficulty: "Intermediate", keywords: ["stash", "untracked"] },
  { id: "stash-list", command: "git stash list", description: "List all stashed snapshots.", example: "git stash list", category: "stash", difficulty: "Beginner", keywords: ["stash", "list"] },
  { id: "stash-show", command: "git stash show", description: "Summarize files changed in the latest stash.", example: "git stash show", category: "stash", difficulty: "Intermediate", keywords: ["stash", "show", "summary"] },
  { id: "stash-show-patch", command: "git stash show -p stash@{0}", description: "Show the full diff of a stash entry.", example: "git stash show -p stash@{0}", category: "stash", difficulty: "Intermediate", keywords: ["stash", "diff", "patch"] },
  { id: "stash-apply", command: "git stash apply", description: "Re-apply the latest stash but keep it in the list.", example: "git stash apply", category: "stash", difficulty: "Beginner", keywords: ["stash", "apply", "restore"] },
  { id: "stash-pop", command: "git stash pop", description: "Re-apply the latest stash and remove it from the list.", example: "git stash pop", category: "stash", difficulty: "Beginner", keywords: ["stash", "pop", "restore"] },
  { id: "stash-drop", command: "git stash drop stash@{0}", description: "Delete one stash entry.", example: "git stash drop stash@{0}", category: "stash", difficulty: "Intermediate", keywords: ["stash", "drop", "delete"] },
  { id: "stash-clear", command: "git stash clear", description: "Delete every stash entry at once.", example: "git stash clear", category: "stash", difficulty: "Intermediate", keywords: ["stash", "clear", "delete"], careful: "Deletes all stashes. Dropped stashes cannot be recovered easily." },

  // ── Tags ────────────────────────────────────────────────────────
  { id: "tags-list", command: "git tag", description: "List all tags in the repo.", example: "git tag", category: "tags", difficulty: "Beginner", keywords: ["tag", "list", "release"] },
  { id: "tags-light", command: "git tag v1.0.0", description: "Mark the current commit with a lightweight tag.", example: "git tag v1.0.0", category: "tags", difficulty: "Beginner", keywords: ["tag", "release", "lightweight"] },
  { id: "tags-annotated", command: 'git tag -a v1.0.0 -m "First stable release"', description: "Create an annotated tag with message, date and author.", example: 'git tag -a v1.0.0 -m "First stable release"', category: "tags", difficulty: "Intermediate", keywords: ["tag", "annotated", "release"] },
  { id: "tags-delete", command: "git tag -d v1.0.0", description: "Delete a local tag.", example: "git tag -d v1.0.0", category: "tags", difficulty: "Intermediate", keywords: ["tag", "delete"] },
  { id: "tags-push-one", command: "git push origin v1.0.0", description: "Share one tag with the remote.", example: "git push origin v1.0.0", category: "tags", difficulty: "Beginner", keywords: ["tag", "push", "share"] },
  { id: "tags-push-all", command: "git push origin --tags", description: "Push all local tags to the remote.", example: "git push origin --tags", category: "tags", difficulty: "Intermediate", keywords: ["tag", "push", "all"] },
  { id: "tags-fetch", command: "git fetch --tags", description: "Download tags from the remote without merging.", example: "git fetch --tags", category: "tags", difficulty: "Intermediate", keywords: ["tag", "fetch"] },
  { id: "tags-checkout", command: "git checkout v1.0.0", description: "Inspect the code exactly as it was at a tag.", example: "git checkout v1.0.0", category: "tags", difficulty: "Intermediate", keywords: ["tag", "checkout", "inspect", "detached"] },
  { id: "tags-show", command: "git show v1.0.0", description: "Show tag metadata and the commit it points to.", example: "git show v1.0.0", category: "tags", difficulty: "Intermediate", keywords: ["tag", "show", "inspect"] },
  { id: "tags-lsremote", command: "git ls-remote --tags origin", description: "List tags on the remote without downloading.", example: "git ls-remote --tags origin", category: "tags", difficulty: "Advanced", keywords: ["tag", "remote", "list"] },

  // ── Rebase ──────────────────────────────────────────────────────
  { id: "rebase-basic", command: "git rebase main", description: "Replay the current branch on top of `main`.", example: "git switch feature && git rebase main", category: "rebase", difficulty: "Intermediate", keywords: ["rebase", "replay", "linear"] },
  { id: "rebase-interactive", command: "git rebase -i HEAD~3", description: "Reword, squash, reorder or drop the last 3 commits.", example: "git rebase -i HEAD~3", category: "rebase", difficulty: "Advanced", keywords: ["rebase", "interactive", "squash", "reword"] },
  { id: "rebase-continue", command: "git rebase --continue", description: "Resume a rebase after resolving conflicts.", example: "git add . && git rebase --continue", category: "rebase", difficulty: "Intermediate", keywords: ["rebase", "continue", "conflict"] },
  { id: "rebase-skip", command: "git rebase --skip", description: "Skip the current conflicting commit and continue rebasing.", example: "git rebase --skip", category: "rebase", difficulty: "Advanced", keywords: ["rebase", "skip", "conflict"] },
  { id: "rebase-abort", command: "git rebase --abort", description: "Cancel the rebase and return to the original state.", example: "git rebase --abort", category: "rebase", difficulty: "Intermediate", keywords: ["rebase", "abort", "cancel"] },
  { id: "rebase-onto", command: "git rebase --onto main old-base feature", description: "Transplant `feature` from `old-base` onto `main`.", example: "git rebase --onto main old-base feature", category: "rebase", difficulty: "Advanced", keywords: ["rebase", "onto", "transplant"] },
  { id: "rebase-autostash", command: "git rebase --autostash main", description: "Stash dirty files automatically, rebase, then restore them.", example: "git rebase --autostash main", category: "rebase", difficulty: "Advanced", keywords: ["rebase", "autostash", "dirty"] },
  { id: "rebase-fixup", command: "git commit --fixup abc1234", description: "Mark a fix to be auto-squashed into an older commit later.", example: "git commit --fixup abc1234", category: "rebase", difficulty: "Advanced", keywords: ["fixup", "autosquash", "rebase"] },
  { id: "rebase-autosquash", command: "git rebase -i --autosquash HEAD~3", description: "Auto-arrange fixup commits during an interactive rebase.", example: "git rebase -i --autosquash HEAD~3", category: "rebase", difficulty: "Advanced", keywords: ["autosquash", "fixup", "rebase"] },
  { id: "rebase-rerere", command: "git config --global rerere.enabled true", description: "Remember conflict resolutions and reuse them automatically.", example: "git config --global rerere.enabled true", category: "rebase", difficulty: "Advanced", keywords: ["rerere", "conflict", "reuse"] },

  // ── Inspecting & Logs ───────────────────────────────────────────
  { id: "inspect-log", command: "git log", description: "Show commit history with messages and metadata.", example: "git log", category: "inspecting", difficulty: "Beginner", keywords: ["log", "history"] },
  { id: "inspect-log-oneline", command: "git log --oneline", description: "Compact one-commit-per-line history.", example: "git log --oneline -10", category: "inspecting", difficulty: "Beginner", keywords: ["log", "oneline", "compact"] },
  { id: "inspect-graph", command: "git log --oneline --graph --decorate --all", description: "Visual branch graph across every branch and tag.", example: "git log --oneline --graph --decorate --all", category: "inspecting", difficulty: "Intermediate", keywords: ["log", "graph", "branch", "visual"] },
  { id: "inspect-log-patch", command: "git log -p -2", description: "Show the actual diffs of the last 2 commits.", example: "git log -p -2", category: "inspecting", difficulty: "Intermediate", keywords: ["log", "patch", "diff"] },
  { id: "inspect-log-stat", command: "git log --stat", description: "Show which files each commit changed.", example: "git log --stat -5", category: "inspecting", difficulty: "Intermediate", keywords: ["log", "stat", "files"] },
  { id: "inspect-log-file", command: "git log -- index.html", description: "Show only commits that touched one file.", example: "git log --oneline -- index.html", category: "inspecting", difficulty: "Intermediate", keywords: ["log", "file", "history"] },
  { id: "inspect-blame", command: "git blame index.html", description: "Show who changed each line last and in which commit.", example: "git blame index.html", category: "inspecting", difficulty: "Intermediate", keywords: ["blame", "annotate", "authorship"] },
  { id: "inspect-show", command: "git show abc1234", description: "Show one commit's message, metadata and diff.", example: "git show abc1234", category: "inspecting", difficulty: "Beginner", keywords: ["show", "commit", "diff"] },
  { id: "inspect-diff-range", command: "git diff main...feature", description: "Compare `feature` against where it diverged from `main`.", example: "git diff main...feature", category: "inspecting", difficulty: "Advanced", keywords: ["diff", "compare", "branch", "range"] },
  { id: "inspect-shortlog", command: "git shortlog --summary --numbered", description: "Count commits per author — who did what.", example: "git shortlog --summary --numbered", category: "inspecting", difficulty: "Intermediate", keywords: ["shortlog", "authors", "stats"] },
  { id: "inspect-grep", command: 'git grep "TODO"', description: "Search tracked files for a string at amazing speed.", example: 'git grep "TODO"', category: "inspecting", difficulty: "Intermediate", keywords: ["grep", "search", "code"] },
  { id: "inspect-bisect-start", command: "git bisect start", description: "Begin a binary search for the commit that introduced a bug.", example: "git bisect start", category: "inspecting", difficulty: "Advanced", keywords: ["bisect", "debug", "bug", "binary"] },
  { id: "inspect-bisect-mark", command: "git bisect bad && git bisect good v1.0.0", description: "Mark the broken and last-known-good points for bisect.", example: "git bisect bad && git bisect good v1.0.0", category: "inspecting", difficulty: "Advanced", keywords: ["bisect", "good", "bad", "debug"] },
  { id: "inspect-sparse-init", command: "git sparse-checkout init --cone", description: "Enable cone-mode sparse checkout for huge monorepos.", example: "git sparse-checkout init --cone", category: "inspecting", difficulty: "Advanced", keywords: ["sparse", "checkout", "monorepo", "partial"] },
  { id: "inspect-sparse-set", command: "git sparse-checkout set apps/web", description: "Check out only selected folders to save disk and time.", example: "git sparse-checkout set apps/web", category: "inspecting", difficulty: "Advanced", keywords: ["sparse", "checkout", "partial", "folder"] },

  // ── GitHub CLI (gh) ─────────────────────────────────────────────
  { id: "gh-auth-login", command: "gh auth login", description: "Authenticate the GitHub CLI with your account.", example: "gh auth login", category: "gh", difficulty: "Beginner", keywords: ["gh", "auth", "login"] },
  { id: "gh-auth-status", command: "gh auth status", description: "Verify which account and hosts `gh` is logged into.", example: "gh auth status", category: "gh", difficulty: "Beginner", keywords: ["gh", "auth", "status"] },
  { id: "gh-repo-create", command: "gh repo create my-app --public --clone", description: "Create a GitHub repo and clone it locally.", example: "gh repo create my-app --public --clone", category: "gh", difficulty: "Intermediate", keywords: ["gh", "repo", "create"] },
  { id: "gh-repo-clone", command: "gh repo clone owner/repo", description: "Clone any GitHub repo with owner/name shorthand.", example: "gh repo clone octocat/Hello-World", category: "gh", difficulty: "Beginner", keywords: ["gh", "clone", "repo"] },
  { id: "gh-repo-view", command: "gh repo view --web", description: "Open the current repo's GitHub page in a browser.", example: "gh repo view --web", category: "gh", difficulty: "Beginner", keywords: ["gh", "view", "web", "open"] },
  { id: "gh-repo-fork", command: "gh repo fork --clone", description: "Fork a repo to your account and clone it.", example: "gh repo fork octocat/Hello-World --clone", category: "gh", difficulty: "Intermediate", keywords: ["gh", "fork", "clone"] },
  { id: "gh-pr-create", command: "gh pr create", description: "Open a pull request from the current branch interactively.", example: "gh pr create", category: "gh", difficulty: "Beginner", keywords: ["gh", "pr", "pull request", "create"] },
  { id: "gh-pr-create-fill", command: "gh pr create --fill", description: "Open a PR auto-filled from commits and branch name.", example: "gh pr create --fill", category: "gh", difficulty: "Intermediate", keywords: ["gh", "pr", "fill", "create"] },
  { id: "gh-pr-list", command: "gh pr list", description: "List open pull requests in the current repo.", example: "gh pr list", category: "gh", difficulty: "Beginner", keywords: ["gh", "pr", "list"] },
  { id: "gh-pr-view", command: "gh pr view 42", description: "Read a PR's title, body, reviews and checks in the terminal.", example: "gh pr view 42", category: "gh", difficulty: "Beginner", keywords: ["gh", "pr", "view"] },
  { id: "gh-pr-checkout", command: "gh pr checkout 42", description: "Check out someone's PR branch locally for testing.", example: "gh pr checkout 42", category: "gh", difficulty: "Intermediate", keywords: ["gh", "pr", "checkout", "review"] },
  { id: "gh-pr-checks", command: "gh pr checks 42", description: "Show CI check results for a pull request.", example: "gh pr checks 42", category: "gh", difficulty: "Intermediate", keywords: ["gh", "pr", "checks", "ci"] },
  { id: "gh-pr-merge", command: "gh pr merge 42 --squash", description: "Merge a PR, squashing its commits into one.", example: "gh pr merge 42 --squash", category: "gh", difficulty: "Intermediate", keywords: ["gh", "pr", "merge", "squash"] },
  { id: "gh-issue-create", command: "gh issue create", description: "File a new issue interactively.", example: "gh issue create", category: "gh", difficulty: "Beginner", keywords: ["gh", "issue", "create", "bug"] },
  { id: "gh-issue-list", command: "gh issue list", description: "List open issues in the current repo.", example: "gh issue list", category: "gh", difficulty: "Beginner", keywords: ["gh", "issue", "list"] },

  // ── Collaboration ───────────────────────────────────────────────
  { id: "collab-sync-fork", command: "git fetch upstream && git merge upstream/main", description: "Bring fork's `main` up to date with the original repo.", example: "git fetch upstream && git switch main && git merge upstream/main", category: "collab", difficulty: "Intermediate", keywords: ["fork", "sync", "upstream", "merge"] },
  { id: "collab-push-pr", command: "git push origin feature/login", description: "Push a feature branch, then open a PR on GitHub.", example: "git push origin feature/login", category: "collab", difficulty: "Beginner", keywords: ["push", "pr", "branch", "share"] },
  { id: "collab-pr-review", command: "gh pr review 42 --approve", description: "Approve a pull request from the terminal.", example: "gh pr review 42 --approve", category: "collab", difficulty: "Intermediate", keywords: ["gh", "review", "approve", "pr"] },
  { id: "collab-pr-diff", command: "gh pr diff 42", description: "Read a PR's full diff without leaving the terminal.", example: "gh pr diff 42", category: "collab", difficulty: "Intermediate", keywords: ["gh", "diff", "review", "pr"] },
  { id: "collab-pr-status", command: "gh pr status", description: "Show PRs you created, assigned or asked to review.", example: "gh pr status", category: "collab", difficulty: "Beginner", keywords: ["gh", "pr", "status", "review"] },
  { id: "collab-cherry-pick", command: "git cherry-pick abc1234", description: "Copy one commit onto the current branch.", example: "git cherry-pick abc1234", category: "collab", difficulty: "Advanced", keywords: ["cherry-pick", "copy", "commit", "backport"] },
  { id: "collab-format-patch", command: "git format-patch -1 abc1234", description: "Export a commit as a shareable `.patch` email file.", example: "git format-patch -1 abc1234", category: "collab", difficulty: "Advanced", keywords: ["patch", "export", "email", "share"] },
  { id: "collab-apply", command: "git apply fix.patch", description: "Apply a patch file to the working tree.", example: "git apply fix.patch", category: "collab", difficulty: "Advanced", keywords: ["apply", "patch", "import"] },
  { id: "collab-release", command: "gh release create v1.0.0 --generate-notes", description: "Publish a release with auto-generated notes.", example: "gh release create v1.0.0 --generate-notes", category: "collab", difficulty: "Intermediate", keywords: ["gh", "release", "notes", "tag"] },
  { id: "collab-range-log", command: "git log origin/main..HEAD", description: "Preview commits your branch would add to a PR.", example: "git log origin/main..HEAD --oneline", category: "collab", difficulty: "Advanced", keywords: ["log", "range", "pr", "preview"] },
  { id: "collab-issue-close", command: "gh issue close 12", description: "Close an issue from the terminal.", example: "gh issue close 12", category: "collab", difficulty: "Beginner", keywords: ["gh", "issue", "close"] },
  { id: "collab-track", command: "git branch --set-upstream-to=origin/main", description: "Point the current branch at a new upstream for pull/push.", example: "git branch --set-upstream-to=origin/main", category: "collab", difficulty: "Advanced", keywords: ["upstream", "track", "branch"] },
];

export const COMMAND_COUNT = COMMANDS.length;
