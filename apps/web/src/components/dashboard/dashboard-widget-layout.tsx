'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode, HTMLAttributes } from "react";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { WidgetGrid } from "@/components/dashboard/widget-grid";

const STORAGE_KEY = "trade-pulse-dashboard-widget-order";
const DEFAULT_LAYOUT = ["ai-summary", "economic-calendar", "watchlist"];

interface DashboardWidgetItem {
  id: string;
  title: string;
  content: ReactNode;
}

interface DashboardWidgetLayoutProps extends HTMLAttributes<HTMLDivElement> {
  widgets: DashboardWidgetItem[];
}

function SortableWidget({ id, title, content }: DashboardWidgetItem) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const ref = useRef<HTMLDivElement | null>(null);

  const setCombinedRef = (node: HTMLDivElement | null) => {
    setNodeRef(node);
    ref.current = node;
  };

  useEffect(() => {
    if (!ref.current) return;
    const transformValue = CSS.Transform.toString(transform);
    ref.current.style.transform = transformValue || "";
    ref.current.style.transition = transition || "";
  }, [transform, transition]);

  return (
    <div
      ref={setCombinedRef}
      className={cn("relative", isDragging && "opacity-80")}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`Drag ${title} widget`}
        className="absolute right-3 top-3 z-10 rounded-full bg-background/80 p-2 text-muted-foreground shadow-sm transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <GripVertical className="h-4 w-4" aria-hidden="true" />
      </button>
      {content}
    </div>
  );
}

export function DashboardWidgetLayout({ widgets, className, ...props }: DashboardWidgetLayoutProps) {
  const [order, setOrder] = useState<string[]>(DEFAULT_LAYOUT);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as string[];
        const valid = Array.isArray(parsed) && parsed.every((value) => typeof value === "string");
        if (valid) {
          const normalized = DEFAULT_LAYOUT.filter((id) => parsed.includes(id));
          const extra = parsed.filter((id) => !DEFAULT_LAYOUT.includes(id));
          setOrder([...normalized, ...extra]);
          return;
        }
      }
    } catch {
      // ignore malformed storage
    }
    setOrder(DEFAULT_LAYOUT);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
  }, [order]);

  const orderedWidgets = useMemo(
    () => order
      .map((id) => widgets.find((widget) => widget.id === id))
      .filter((widget): widget is DashboardWidgetItem => Boolean(widget)),
    [order, widgets],
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setOrder((currentOrder) => {
      const oldIndex = currentOrder.indexOf(active.id as string);
      const newIndex = currentOrder.indexOf(over.id as string);
      if (oldIndex === -1 || newIndex === -1) return currentOrder;
      return arrayMove(currentOrder, oldIndex, newIndex);
    });
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <WidgetGrid className={className} {...props}>
        <SortableContext items={order} strategy={rectSortingStrategy}>
          {orderedWidgets.map((widget) => (
            <SortableWidget key={widget.id} id={widget.id} title={widget.title} content={widget.content} />
          ))}
        </SortableContext>
      </WidgetGrid>
    </DndContext>
  );
}
