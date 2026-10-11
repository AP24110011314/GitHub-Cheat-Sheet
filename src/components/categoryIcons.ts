import {
  Archive,
  Cloud,
  FolderPlus,
  GitBranch,
  GitCommitHorizontal,
  History,
  Settings,
  Tag,
  Terminal,
  Undo2,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import type { CategoryId } from "../data/commands";

/** One icon per category. Rebase reuses the branching icon family. */
export const CATEGORY_ICONS: Record<CategoryId, LucideIcon> = {
  setup: Settings,
  creating: FolderPlus,
  staging: GitCommitHorizontal,
  branching: GitBranch,
  remote: Cloud,
  undoing: Undo2,
  stash: Archive,
  tags: Tag,
  rebase: Workflow,
  inspecting: History,
  gh: Terminal,
  collab: Users,
};

/** Consistent icon sizing across the app (18px default, strokeWidth 2). */
export const ICON_SIZE = 18;
export const ICON_STROKE = 2;
