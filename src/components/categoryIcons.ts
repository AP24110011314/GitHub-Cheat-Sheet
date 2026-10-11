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
 * Category-to-icon mapping:
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
 * Category palette: light values unchanged; dark values re-mapped to
 * Forest Sage palette — sage (#97A87A) tint icons for informational categories,
 * amber (#DB9558) tint for interactive/action categories.
 *
 * The split: "reading/browsing" categories get sage tones; "writing/mutating"
 * categories get amber tones. This matches the semantic role distinction.
 */
export interface CategoryPaletteItem {
  /** Icon / accent color in light mode */
  light: string;
  /** Icon / accent color in dark mode (Forest Sage) */
  dark: string;
  /** Light-mode section border / top bar */
  lightBorder: string;
  /** Dark-mode section border / top bar */
  darkBorder: string;
}

export const CATEGORY_PALETTE: Record<CategoryId, CategoryPaletteItem> = {
  // Sage tones — informational / read-only categories
  setup: {
    light: "#6F7E68",
    dark: "#97A87A",   // sage
    lightBorder: "#92A28C",
    darkBorder: "#3A4A35",
  },
  inspecting: {
    light: "#6A6046",
    dark: "#A8BBA3",   // light sage
    lightBorder: "#8E8367",
    darkBorder: "#3A4A35",
  },
  gh: {
    light: "#4E7345",
    dark: "#97A87A",   // sage
    lightBorder: "#72966A",
    darkBorder: "#3A4A35",
  },
  collab: {
    light: "#935C24",
    dark: "#A8BBA3",   // light sage
    lightBorder: "#B67E44",
    darkBorder: "#3A4A35",
  },

  // Amber tones — interactive / write categories
  creating: {
    light: "#648455",
    dark: "#DB9558",   // amber
    lightBorder: "#88A67B",
    darkBorder: "#3A4A35",
  },
  staging: {
    light: "#547849",
    dark: "#DB9558",   // amber
    lightBorder: "#789B6E",
    darkBorder: "#3A4A35",
  },
  branching: {
    light: "#A46628",
    dark: "#DB9558",   // amber
    lightBorder: "#C88949",
    darkBorder: "#3A4A35",
  },
  remote: {
    light: "#9A6321",
    dark: "#DB9558",   // amber
    lightBorder: "#BD8543",
    darkBorder: "#3A4A35",
  },
  undoing: {
    light: "#A43E08",
    dark: "#B8743A",   // amber-brown (destructive)
    lightBorder: "#C75C20",
    darkBorder: "#3A4A35",
  },
  stash: {
    light: "#8F5827",
    dark: "#DB9558",   // amber
    lightBorder: "#B27A4A",
    darkBorder: "#3A4A35",
  },
  tags: {
    light: "#7F4B26",
    dark: "#97A87A",   // sage (tags = informational)
    lightBorder: "#A46C44",
    darkBorder: "#3A4A35",
  },
  rebase: {
    light: "#9A3C10",
    dark: "#B8743A",   // amber-brown (rebase = risky)
    lightBorder: "#BD5523",
    darkBorder: "#3A4A35",
  },
};

/** Consistent icon sizing across the app (18px default, strokeWidth 2). */
export const ICON_SIZE = 18;
export const ICON_STROKE = 2;
