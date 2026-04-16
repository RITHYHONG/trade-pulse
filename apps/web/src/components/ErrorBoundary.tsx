import React from 'react';
import { Button } from '@/components/ui/button';

type Props = { children: React.ReactNode };

export class ErrorBoundary extends React.Component<Props, { hasError: boolean }> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    // Log to monitoring service if configured
    console.error('ErrorBoundary caught', error, info);
  }

  reset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 rounded-lg bg-destructive/10 border border-destructive">
          <h3 className="font-semibold">Something went wrong</h3>
          <p className="text-sm text-muted-foreground">This widget failed to load.</p>
          <div className="mt-4">
            <Button size="sm" onClick={this.reset}>Retry</Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
