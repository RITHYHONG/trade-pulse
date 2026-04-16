'use client';

import { useEffect, useMemo, useRef, Suspense } from "react";
import type { ReactNode, HTMLAttributes } from "react";
import { DndContext, DragEndEvent, PointerSensor, KeyboardSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, useSortable, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { WidgetGrid } from "@/components/dashboard/widget-grid";
import { dashboardStore } from "@/store/dashboard-store";
import { DashboardPreferencesSync } from "@/components/dashboard/DashboardPreferencesSync";

const DEFAULT_LAYOUT = ["ai-summary", "economic-calendar", "watchlist"];

interface DashboardWidgetItem {
  id: string;
  title: string;
  content: ReactNode;
}

interface DashboardWidgetLayoutProps extends HTMLAttributes<HTMLDivElement> {
  widgets: DashboardWidgetItem[];
}

function SortableWidget({ id, title, content, collapsed, onToggleCollapse }: {
  id: string;
  title: string;
  content: ReactNode;
  collapsed?: boolean;
  onToggleCollapse?: (id: string) => void;
}) {
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
      <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label={`Drag ${title} widget`}
          className="rounded-full bg-background/80 p-2 text-muted-foreground shadow-sm transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <GripVertical className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onToggleCollapse?.(id)}
          aria-pressed={collapsed}
          aria-label={`${collapsed ? 'Expand' : 'Collapse'} ${title} widget`}
          className="rounded-full bg-background/80 p-2 text-muted-foreground shadow-sm transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <span className="sr-only">{collapsed ? 'Expand' : 'Collapse'}</span>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
            {collapsed ? (
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d="M6 15l6-6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
        </button>
      </div>
      {!collapsed ? (
        <Suspense fallback={<div className="h-64 rounded-xl bg-muted/20 animate-pulse" />}>
          {content}
        </Suspense>
      ) : (
        <div className="p-4 text-sm text-muted-foreground">Widget collapsed</div>
      )}
    </div>
  );
}

export function DashboardWidgetLayout({ widgets, className, ...props }: DashboardWidgetLayoutProps) {
  const layout = dashboardStore((s) => s.layout);
  const setLayout = dashboardStore((s) => s.setLayout);
  const toggleWidget = dashboardStore((s) => s.toggleWidget);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const order = layout && layout.length ? layout.map((w) => w.id) : DEFAULT_LAYOUT;

  const orderedWidgets = useMemo(
    () => order
      .map((id) => widgets.find((widget) => widget.id === id))
      .filter((widget): widget is DashboardWidgetItem => Boolean(widget)),
    [order, widgets],
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = layout.findIndex((w) => w.id === (active.id as string));
    const newIndex = layout.findIndex((w) => w.id === (over.id as string));
    if (oldIndex === -1 || newIndex === -1) return;

    const newLayout = arrayMove(layout, oldIndex, newIndex);
    setLayout(newLayout);
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <DashboardPreferencesSync />
      <WidgetGrid className={className} {...props}>
        <SortableContext items={order} strategy={rectSortingStrategy}>
          {orderedWidgets.map((widget) => {
            const collapsed = layout.find((w) => w.id === widget.id)?.collapsed ?? false;
            return (
              <SortableWidget
                key={widget.id}
                id={widget.id}
                title={widget.title}
                content={widget.content}
                collapsed={collapsed}
                onToggleCollapse={() => toggleWidget(widget.id)}
              />
            );
          })}
        </SortableContext>
      </WidgetGrid>
    </DndContext>
  );
}
