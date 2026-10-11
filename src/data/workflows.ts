import type { Difficulty } from "./commands";

export interface WorkflowStep {
  title: string;
  command?: string;
  explanation: string;
}

export interface Workflow {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  steps: WorkflowStep[];
}

export const WORKFLOWS: Workflow[] = [
  {
    id: "undo-last-commit",
    title: "Undo last commit (keep changes)",
    description: "You committed too early. Keep the edits, drop the commit.",
    difficulty: "Beginner",
    steps: [
      { title: "Check what you are about to undo", command: "git log --oneline -3 && git status", explanation: "Confirm the top commit is the one you want to drop." },
      { title: "Undo the commit, keep edits unstaged", command: "git reset HEAD~1", explanation: "The commit disappears but all file changes stay in your working tree." },
      { title: "Re-stage and commit again", command: "git add -p && git commit -m \"Your message\"", explanation: "Stage exactly what you want this time, then commit." },
    ],
  },
  {
    id: "fix-commit-message",
    title: "Fix a wrong commit message",
    description: "Typo in the last message? Rewrite it before pushing.",
    difficulty: "Beginner",
    steps: [
      { title: "Make sure it is the latest commit", command: "git log --oneline -2", explanation: "amend only rewrites the most recent commit." },
      { title: "Rewrite the message", command: 'git commit --amend -m "Correct message"', explanation: "Opens the last commit for editing; nothing else changes." },
      { title: "If already pushed, push safely", command: "git push --force-with-lease", explanation: "Updates the remote only if nobody else pushed meanwhile." },
    ],
  },
  {
    id: "sync-fork",
    title: "Sync a fork with upstream",
    description: "Pull the original repo's latest work into your fork.",
    difficulty: "Intermediate",
    steps: [
      { title: "Register the original repo once", command: "git remote add upstream https://github.com/original/repo.git", explanation: "Skip if `git remote -v` already shows an upstream." },
      { title: "Fetch and merge upstream main", command: "git fetch upstream && git switch main && git merge upstream/main", explanation: "Fast-forwards your main to match the original." },
      { title: "Push the update to your fork", command: "git push origin main", explanation: "Your GitHub fork is now in sync." },
    ],
  },
  {
    id: "merge-conflict",
    title: "Resolve a merge conflict",
    description: "Conflicting edits? Resolve them deliberately and finish the merge.",
    difficulty: "Intermediate",
    steps: [
      { title: "See which files conflict", command: "git status", explanation: "Conflicted files are listed as “both modified”." },
      { title: "Edit markers, then mark resolved", command: "git add index.html", explanation: "Remove the <<<<<<< / ======= / >>>>>>> markers, keep the right code, then stage." },
      { title: "Finish the merge", command: "git commit", explanation: "Git pre-fills a merge message — save it to complete." },
      { title: "Bail out if it goes wrong", command: "git merge --abort", explanation: "Restores the pre-merge state so you can retry." },
    ],
  },
  {
    id: "squash-pr",
    title: "Squash commits before a PR",
    description: "Turn a messy branch into one clean commit for review.",
    difficulty: "Advanced",
    steps: [
      { title: "Count your branch commits", command: "git log origin/main..HEAD --oneline", explanation: "Shows exactly what the PR contains." },
      { title: "Interactively squash them", command: "git rebase -i origin/main", explanation: "Keep `pick` on the first line, change the rest to `squash`, save and edit the message." },
      { title: "Push the rewritten branch", command: "git push --force-with-lease", explanation: "Required after rewriting history; the lease guards teammates' work." },
    ],
  },
  {
    id: "recover-lost-commit",
    title: "Recover a lost commit or branch",
    description: "Deleted a branch or reset too far? The reflog remembers.",
    difficulty: "Advanced",
    steps: [
      { title: "Find the lost commit", command: "git reflog", explanation: "Every HEAD movement is listed with its hash, even deleted branches." },
      { title: "Inspect before restoring", command: "git show abc1234 --stat", explanation: "Confirm the hash holds the work you lost." },
      { title: "Restore it as a branch", command: "git branch recovery abc1234", explanation: "Creates a branch pointing at the rescued commit." },
    ],
  },
  {
    id: "feature-pr-gh",
    title: "Start a feature and open a PR with gh",
    description: "The everyday loop: branch, commit, push, propose.",
    difficulty: "Beginner",
    steps: [
      { title: "Create a feature branch", command: "git switch -c feature/short-name", explanation: "Branch from an up-to-date main." },
      { title: "Commit and push with tracking", command: "git add -p && git commit -m \"Describe the change\" && git push -u origin feature/short-name", explanation: "Partial staging keeps the commit focused." },
      { title: "Open the pull request", command: "gh pr create --fill", explanation: "Drafts title and body from your commits; edit before submitting." },
    ],
  },
];
