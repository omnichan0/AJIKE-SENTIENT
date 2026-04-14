/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AjikeShell } from './components/AjikeShell';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-black text-white p-4">
          <div className="max-w-2xl w-full bg-red-950/50 border border-red-500/50 rounded-xl p-6 space-y-4">
            <h1 className="text-xl font-bold text-red-400">System Failure</h1>
            <p className="text-sm text-red-200/70">A critical error occurred in the kernel.</p>
            <pre className="bg-black/50 p-4 rounded-lg text-xs font-mono text-red-300 overflow-auto">
              {this.state.error?.message}
              {'\n\n'}
              {this.state.error?.stack}
            </pre>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-medium transition-colors"
            >
              Reboot System
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <div className="dark">
      <ErrorBoundary>
        <AjikeShell />
      </ErrorBoundary>
    </div>
  );
}

