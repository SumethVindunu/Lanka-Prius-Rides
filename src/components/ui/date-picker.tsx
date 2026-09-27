"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled = false,
  minDate,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date>(value || new Date());

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal h-11 px-4 rounded-xl bg-background/80 border border-amber-500/15 hover:border-amber-400 hover:bg-background/80 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] transition-all duration-300",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarDays className="mr-2 h-4 w-4 text-amber-400 shrink-0" />
          {value ? (
            <span className="text-foreground">
              {format(value, "EEEE, MMM d, yyyy")}
            </span>
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange(date);
              setOpen(false);
            }}
            disabled={minDate ? { before: minDate } : undefined}
            month={month}
            onMonthChange={setMonth}
          />
        </PopoverContent>
    </Popover>
  );
}
