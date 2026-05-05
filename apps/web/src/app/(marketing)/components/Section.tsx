"use client";

import React, { ReactNode } from 'react';

type SectionProps = {
  id?: string;
  children?: ReactNode;
  className?: string;
  /** keep default scroll margin for anchors (set false to opt-out) */
  scrollMt?: boolean;
};

export default function Section({ id, children, className = '', scrollMt = true }: SectionProps) {
  const base = `${scrollMt ? 'scroll-mt-24' : ''} py-24 relative overflow-hidden bg-transparent`;

  return (
    <section id={id} className={`${base} ${className}`}>
      <div className="relative z-10">{children}</div>
    </section>
  );
}
