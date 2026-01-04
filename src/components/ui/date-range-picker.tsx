"use client";

import * as React from "react";
import { format } from 'date-fns';
import { Popover, PopoverTrigger, PopoverContent } from './popover';
import { Button } from './button';
import { Calendar } from './calendar';
import { Input } from './input';

interface RangeValue {
  start?: Date | null;
  end?: Date | null;
}

interface DateRangePickerProps {
  value?: RangeValue;
  onChange: (range: RangeValue) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);

  const formatted = value?.start && value?.end
    ? `${format(value.start, 'yyyy-MM-dd')} → ${format(value.end, 'yyyy-MM-dd')}`
    : value?.start
      ? format(value.start, 'yyyy-MM-dd')
      : '';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between h-9">
          <span className={`text-sm ${formatted ? 'text-foreground/90' : 'text-muted-foreground'}`}>
            {formatted || 'Select range'}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <div className="p-3">
          <Calendar
            mode="range"
            selected={value?.start && value?.end ? { from: value.start, to: value.end } : undefined}
            onSelect={(range: any) => {
              onChange({ start: range?.from || undefined, end: range?.to || undefined });
            }}
          />

          <div className="flex items-center justify-between mt-2">
            <Button variant="ghost" size="sm" onClick={() => onChange({})}>
              Clear
            </Button>
            <Button size="sm" onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
