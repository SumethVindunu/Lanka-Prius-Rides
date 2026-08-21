"use client";

import * as React from "react";
import {
  DayPicker,
  getDefaultClassNames,
  type DayButtonProps,
} from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: DayButtonProps) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <button
      className={cn(
        defaultClassNames.day_button,
        "inline-flex items-center justify-center rounded-lg text-sm font-medium h-9 w-9 p-0 transition-all duration-200",
        "hover:bg-cyan-500/10 hover:text-cyan-400",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400",
        modifiers.selected &&
          "bg-cyan-500 text-black font-bold hover:bg-cyan-400 hover:text-black shadow-[0_0_12px_rgba(0,255,255,0.3)]",
        modifiers.today &&
          !modifiers.selected &&
          "bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/30",
        modifiers.outside && "text-gray-600 opacity-50",
        modifiers.disabled && "text-gray-700 opacity-30 cursor-not-allowed",
        className
      )}
      data-day={day.date.toLocaleDateString()}
      data-selected={modifiers.selected}
      data-today={modifiers.today}
      data-outside={modifiers.outside}
      data-disabled={modifiers.disabled}
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      {...props}
    >
      {day.date.getDate()}
    </button>
  );
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      className={cn("p-3", className)}
      classNames={{
        root: cn(defaultClassNames.root, "text-gray-200"),
        months: cn(defaultClassNames.months, "flex flex-col sm:flex-row gap-4"),
        month: cn(defaultClassNames.month, "flex flex-col gap-4"),
        month_caption: cn(
          defaultClassNames.month_caption,
          "flex justify-center pt-1 relative items-center mb-1"
        ),
        caption_label: cn(
          defaultClassNames.caption_label,
          "text-sm font-semibold text-white font-orbitron tracking-wide"
        ),
        nav: cn(defaultClassNames.nav, "flex items-center gap-1"),
        button_previous: cn(
          defaultClassNames.button_previous,
          buttonVariants({ variant: "ghost", size: "icon" }),
          "h-8 w-8 bg-transparent text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 absolute left-1 top-0"
        ),
        button_next: cn(
          defaultClassNames.button_next,
          buttonVariants({ variant: "ghost", size: "icon" }),
          "h-8 w-8 bg-transparent text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 absolute right-1 top-0"
        ),
        month_grid: cn(defaultClassNames.month_grid, "w-full border-collapse"),
        weekdays: cn(defaultClassNames.weekdays, "flex"),
        weekday: cn(
          defaultClassNames.weekday,
          "text-gray-500 rounded-md w-9 font-medium text-[0.7rem] uppercase"
        ),
        week: cn(defaultClassNames.week, "flex w-full mt-1"),
        day: cn(
          defaultClassNames.day,
          "h-9 w-9 text-center text-sm p-0 relative"
        ),
        day_button: cn(defaultClassNames.day_button),
        range_start: cn(defaultClassNames.range_start, "rounded-l-lg"),
        range_end: cn(defaultClassNames.range_end, "rounded-r-lg"),
        selected: cn(defaultClassNames.selected),
        today: cn(defaultClassNames.today),
        outside: cn(defaultClassNames.outside),
        disabled: cn(defaultClassNames.disabled),
        range_middle: cn(
          defaultClassNames.range_middle,
          "bg-cyan-500/10 text-cyan-400"
        ),
        hidden: cn(defaultClassNames.hidden, "invisible"),
        ...classNames,
      }}
      components={{
        DayButton: CalendarDayButton,
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          ),
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
