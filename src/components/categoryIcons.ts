import {
  Archive,
  Cloud,
  FolderPlus,
  GitBranch,
  GitCommit,
  GitMerge,
  History,
  Settings,
  Tag,
  Terminal,
  Undo2,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { CategoryId } from "../data/commands";

/**
 * Category-to-icon mapping matching the designated toolset:
 * - Settings: Setup & Config
 * - FolderPlus: Creating Repos
 * - GitCommit: Staging & Committing
 * - GitBranch: Branching & Merging
 * - GitMerge: Rebase
 * - Cloud: Remote & Syncing
 * - Undo2: Undoing Changes
 * - Archive: Stash
 * - Tag: Tags
 * - History: Inspecting & Logs
 * - Terminal: GitHub CLI
 * - Users: Collaboration
 */
export const CATEGORY_ICONS: Record<CategoryId, LucideIcon> = {
  setup: Settings,
  creating: FolderPlus,
  staging: GitCommit,
  branching: GitBranch,
  remote: Cloud,
  undoing: Undo2,
  stash: Archive,
  tags: Tag,
  rebase: GitMerge,
  inspecting: History,
  gh: Terminal,
  collab: Users,
};

/**
 * Subtle tint variations within the warm earthy family for each category
 * (no blues, purples, or neons). Light and dark shades tailored for contrast.
 */
export interface CategoryPaletteItem {
  light: string;
  dark: string;
  lightBorder: string;
  darkBorder: string;
}

export const CATEGORY_PALETTE: Record<CategoryId, CategoryPaletteItem> = {
  setup: {
    light: "#6F7E68",
    dark: "#9FAF98",
    lightBorder: "#92A28C",
    darkBorder: "#465342",
  },
  creating: {
    light: "#648455",
    dark: "#8EAE7E",
    lightBorder: "#88A67B",
    darkBorder: "#3E5533",
  },
  staging: {
    light: "#547849",
    dark: "#7E9F74",
    lightBorder: "#789B6E",
    darkBorder: "#344E2C",
  },
  branching: {
    light: "#A46628",
    dark: "#E89F52",
    lightBorder: "#C88949",
    darkBorder: "#5A3816",
  },
  remote: {
    light: "#9A6321",
    dark: "#DE9942",
    lightBorder: "#BD8543",
    darkBorder: "#573812",
  },
  undoing: {
    light: "#A43E08",
    dark: "#D4621A",
    lightBorder: "#C75C20",
    darkBorder: "#5B2104",
  },
  stash: {
    light: "#8F5827",
    dark: "#D38F54",
    lightBorder: "#B27A4A",
    darkBorder: "#513115",
  },
  tags: {
    light: "#7F4B26",
    dark: "#C38053",
    lightBorder: "#A46C44",
    darkBorder: "#482811",
  },
  rebase: {
    light: "#9A3C10",
    dark: "#D4621A",
    lightBorder: "#BD5523",
    darkBorder: "#5A2207",
  },
  inspecting: {
    light: "#6A6046",
    dark: "#9E9477",
    lightBorder: "#8E8367",
    darkBorder: "#423B2A",
  },
  gh: {
    light: "#4E7345",
    dark: "#789D6F",
    lightBorder: "#72966A",
    darkBorder: "#2E4728",
  },
  collab: {
    light: "#935C24",
    dark: "#D89551",
    lightBorder: "#B67E44",
    darkBorder: "#533312",
  },
};

/** Consistent icon sizing across the app (18px default, strokeWidth 2). */
export const ICON_SIZE = 18;
export const ICON_STROKE = 2;
