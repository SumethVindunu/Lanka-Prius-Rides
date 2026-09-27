"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface TimePickerProps {
  value: string; // "HH:mm" 24h format
  onChange: (time: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function TimePicker({
  value,
  onChange,
  placeholder = "Pick a time",
  disabled = false,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Parse current value
  const parsed = React.useMemo(() => {
    if (!value) return { hour: 0, minute: 0, period: "AM" as const };
    const [h, m] = value.split(":").map(Number);
    return {
      hour: h % 12 || 12,
      minute: m,
      period: (h >= 12 ? "PM" : "AM") as "AM" | "PM",
    };
  }, [value]);

  const formatDisplay = React.useMemo(() => {
    if (!value) return "";
    return `${String(parsed.hour).padStart(2, "0")}:${String(parsed.minute).padStart(2, "0")} ${parsed.period}`;
  }, [value, parsed]);

  const setTime = (hour: number, minute: number, period: "AM" | "PM") => {
    let h24 = hour;
    if (period === "AM" && hour === 12) h24 = 0;
    else if (period === "PM" && hour !== 12) h24 = hour + 12;
    const timeStr = `${String(h24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    onChange(timeStr);
  };

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

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
          <Clock className="mr-2 h-4 w-4 text-amber-400 shrink-0" />
          {value ? (
            <span className="text-foreground">{formatDisplay}</span>
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3">
          <p className="text-xs text-muted-foreground font-medium mb-3 text-center font-orbitron tracking-wider">
            SELECT TIME
          </p>
          <div className="flex gap-2">
            {/* Hours */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-muted-foreground mb-1 font-medium uppercase">
                Hour
              </span>
              <ScrollArea className="h-48 w-14 rounded-lg border border-border">
                <div className="p-1">
                  {hours.map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setTime(h, parsed.minute, parsed.period)}
                      className={cn(
                        "w-full px-2 py-1.5 text-sm rounded-md transition-all text-center cursor-pointer",
                        parsed.hour === h
                          ? "bg-amber-500 text-black font-bold shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                          : "text-foreground hover:bg-amber-500/10 hover:text-amber-400"
                      )}
                    >
                      {String(h).padStart(2, "0")}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <Separator orientation="vertical" className="h-48 mt-5" />

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-muted-foreground mb-1 font-medium uppercase">
                Min
              </span>
              <ScrollArea className="h-48 w-14 rounded-lg border border-border">
                <div className="p-1">
                  {minutes.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setTime(parsed.hour, m, parsed.period)}
                      className={cn(
                        "w-full px-2 py-1.5 text-sm rounded-md transition-all text-center cursor-pointer",
                        parsed.minute === m
                          ? "bg-amber-500 text-black font-bold shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                          : "text-foreground hover:bg-amber-500/10 hover:text-amber-400"
                      )}
                    >
                      {String(m).padStart(2, "0")}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <Separator orientation="vertical" className="h-48 mt-5" />

            {/* AM/PM */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-muted-foreground mb-1 font-medium uppercase">
                &nbsp;
              </span>
              <div className="flex flex-col gap-1 mt-1">
                {(["AM", "PM"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setTime(parsed.hour, parsed.minute, p)}
                    className={cn(
                      "px-3 py-3 text-sm rounded-lg font-semibold transition-all cursor-pointer",
                      parsed.period === p && value
                        ? "bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                        : "text-muted-foreground hover:bg-amber-500/10 hover:text-amber-400 border border-border"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick presets */}
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-[10px] text-muted-foreground font-medium mb-2 uppercase">
              Quick Select
            </p>
            <div className="grid grid-cols-4 gap-1">
              {[
                { label: "6 AM", time: "06:00" },
                { label: "9 AM", time: "09:00" },
                { label: "12 PM", time: "12:00" },
                { label: "3 PM", time: "15:00" },
                { label: "6 PM", time: "18:00" },
                { label: "9 PM", time: "21:00" },
                { label: "12 AM", time: "00:00" },
                { label: "3 AM", time: "03:00" },
              ].map((preset) => (
                <button
                  key={preset.time}
                  type="button"
                  onClick={() => {
                    onChange(preset.time);
                    setOpen(false);
                  }}
                  className={cn(
                    "px-2 py-1 text-xs rounded-md transition-all cursor-pointer",
                    value === preset.time
                      ? "bg-amber-500/20 text-amber-400 font-medium"
                      : "text-muted-foreground hover:bg-amber-500/10 hover:text-amber-400"
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
