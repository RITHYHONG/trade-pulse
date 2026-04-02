// @vitest-environment jsdom
/**
 * Accessibility tests for legal components using axe-core.
 * These tests verify that LegalHeader, LegalLayout, and key
 * accessibility attributes meet WCAG 2.1 AA standards.
 */
import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import axe from 'axe-core';

// Mock next/link to avoid router dependency in tests
vi.mock('next/link', () => ({
  default: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}));

// Mock lucide-react icons with named exports matching what LegalHeader needs
vi.mock('lucide-react', () => ({
  Download: () => <svg aria-hidden="true" />,
  Printer: () => <svg aria-hidden="true" />,
  Shield: () => <svg aria-hidden="true" />,
  Globe: () => <svg aria-hidden="true" />,
}));

// Mock @/components/ui/button - must match how LegalHeader uses it
vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    className,
    'aria-label': ariaLabel,
    'aria-expanded': ariaExpanded,
    'aria-controls': ariaControls,
    'aria-current': ariaCurrent,
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
      onClick={onClick}
      className={className}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded as boolean | undefined}
      aria-controls={ariaControls}
      aria-current={ariaCurrent}
    >
      {children}
    </button>
  ),
  buttonVariants: () => '',
}));

import LegalHeader from '../LegalHeader';
import LegalLayout from '../LegalLayout';

async function runAxe(container: HTMLElement) {
  const results = await axe.run(container);
  return results.violations;
}

describe('LegalHeader accessibility', () => {
  it('renders without axe violations (no region selector)', async () => {
    const { container } = render(
      <LegalHeader
        title="Terms of Service"
        version="v1.0"
        effectiveDate="January 1, 2025"
        onDownload={() => {}}
        onPrint={() => {}}
      />,
    );
    const violations = await runAxe(container);
    expect(violations).toHaveLength(0);
  });

  it('renders without axe violations (with region selector)', async () => {
    const { container } = render(
      <LegalHeader
        title="Privacy Policy"
        version="v2.1"
        effectiveDate="March 15, 2024"
        selectedRegion="Global"
        regions={['Global', 'EU', 'California']}
        onRegionChange={() => {}}
        onDownload={() => {}}
        onPrint={() => {}}
        onRequestData={() => {}}
      />,
    );
    const violations = await runAxe(container);
    expect(violations).toHaveLength(0);
  });

  it('h1 title is present and correct', () => {
    const { container } = render(
      <LegalHeader
        title="Terms of Service"
        onPrint={() => {}}
      />,
    );
    const h1 = container.querySelector('h1');
    expect(h1).toBeTruthy();
    expect(h1?.textContent).toBe('Terms of Service');
  });

  it('region selector has accessible label when shown', () => {
    const { container } = render(
      <LegalHeader
        title="Privacy Policy"
        selectedRegion="Global"
        regions={['Global', 'EU']}
        onRegionChange={() => {}}
      />,
    );
    const select = container.querySelector('select[aria-label="Select your region"]');
    expect(select).toBeTruthy();
  });

  it('does not render region selector when regions prop is absent', () => {
    const { container } = render(
      <LegalHeader title="Terms of Service" />,
    );
    const select = container.querySelector('select[aria-label="Select your region"]');
    expect(select).toBeNull();
  });

  it('Request Data button is hidden when onRequestData is not provided', () => {
    const { container } = render(
      <LegalHeader title="Terms of Service" onPrint={() => {}} onDownload={() => {}} />,
    );
    const btn = container.querySelector('button[aria-label="Request Data"]');
    expect(btn).toBeNull();
  });

  it('Request Data button is shown when onRequestData is provided', () => {
    const { container } = render(
      <LegalHeader title="Privacy Policy" onRequestData={() => {}} />,
    );
    const btn = container.querySelector('button[aria-label="Request Data"]');
    expect(btn).toBeTruthy();
  });
});

describe('LegalLayout accessibility', () => {
  it('renders children without axe violations', async () => {
    const { container } = render(
      <LegalLayout>
        <main>
          <h2>Section</h2>
          <p>Content</p>
        </main>
      </LegalLayout>,
    );
    const violations = await runAxe(container);
    expect(violations).toHaveLength(0);
  });
});
