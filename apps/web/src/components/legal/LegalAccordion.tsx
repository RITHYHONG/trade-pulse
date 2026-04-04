"use client";

import React, { useId } from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { ChevronDown } from 'lucide-react';

interface Props {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function LegalAccordion({ title, icon, children, defaultOpen = false }: Props) {
  const id = useId();
  const value = `item-${id}`;

  return (
    <Accordion type="single" collapsible defaultValue={defaultOpen ? value : undefined} className="mb-6">
      <AccordionItem value={value} className="border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:border-blue-500/20 transition-all duration-300">
        <AccordionTrigger className="w-full flex items-center justify-between p-8 bg-slate-50 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-900 transition-all group outline-none">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform shadow-sm">
              {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white text-left tracking-tight">{title}</h3>
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-8 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <div className="prose prose-slate dark:prose-invert max-w-none prose-p:text-slate-500 dark:prose-p:text-slate-400 prose-p:leading-relaxed">
            {children}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

