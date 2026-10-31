import { cn } from "@/lib/utils";
import type { CalendarDayCell } from "./types";
import { type ActivityLevel, getActivityLevel } from "./utils";

/**
 * The square chip inside a cell carries every visual. `max-w-[30px]` caps it so a wider
 * container spends its surplus on hit area rather than row height; the 224px rail's ~25px
 * columns sit below the cap and are unaffected.
 */
const CHIP_BASE =
  "relative flex aspect-square w-full max-w-[30px] items-center justify-center rounded-md text-center text-xs font-normal leading-none tracking-[-0.01em] tabular-nums transition-[background-color,color,filter,box-shadow] duration-150 ease-out";

/** Hover reads off the cell (`group/day`), not the chip, so the whole column responds to the pointer. */
const INTERACTIVE_CHIP =
  "group-hover/day:brightness-[0.97] group-focus-visible/day:ring-2 group-focus-visible/day:ring-ring/40 group-focus-visible/day:ring-inset";

const OUTSIDE_MONTH_CHIP = "bg-transparent text-muted-foreground/25";
const EMPTY_CHIP = "bg-transparent text-foreground/75 group-hover/day:bg-muted/40";
/** A picked day uses flomo's quiet mint calendar fill instead of the stronger action color. */
const SELECTED_CHIP = "z-10 bg-[var(--calendar-selected)] font-medium text-[var(--calendar-selected-foreground)]";

/** Flomo-style mint activity levels, ending at the exact #c2e8d1 reference color. */
const INTENSITY_TINTS: Record<Exclude<ActivityLevel, 0>, string> = {
  1: "bg-[var(--calendar-activity-1)] text-foreground/75",
  2: "bg-[var(--calendar-activity-2)] text-foreground/80",
  3: "bg-[var(--calendar-activity-3)] text-foreground/80",
  4: "bg-[var(--calendar-activity-4)] text-foreground/85",
};

/**
 * The same ladder for a full calendar day cell, with its hover step: lighter than the chip
 * because excerpts and photos sit on top. Kept beside the chip's so the two cannot drift.
 */
export const DAY_CELL_FILLS: Record<ActivityLevel, string> = {
  0: "bg-card hover:bg-muted/40",
  1: "bg-[var(--calendar-activity-1)] hover:bg-[var(--calendar-activity-2)]",
  2: "bg-[var(--calendar-activity-2)] hover:bg-[var(--calendar-activity-3)]",
  3: "bg-[var(--calendar-activity-3)] hover:bg-[var(--calendar-activity-4)]",
  4: "bg-[var(--calendar-activity-4)] hover:brightness-[0.97]",
};

const getFillClass = (day: CalendarDayCell, maxCount: number): string => {
  if (!day.isCurrentMonth) return OUTSIDE_MONTH_CHIP;
  // Selected owns the fill outright so the empty-cell hover tint cannot replace the calendar mint.
  if (day.isSelected) return SELECTED_CHIP;
  const level = getActivityLevel(day.count, maxCount);
  return level === 0 ? EMPTY_CHIP : INTENSITY_TINTS[level];
};

export const getChipClassName = (day: CalendarDayCell, maxCount: number, isInteractive: boolean): string =>
  cn(CHIP_BASE, getFillClass(day, maxCount), isInteractive && day.isCurrentMonth && INTERACTIVE_CHIP);
