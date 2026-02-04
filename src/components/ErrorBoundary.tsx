import React, { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
    errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log error details for debugging
        console.error('Error caught by ErrorBoundary:', error, errorInfo);

        this.setState({
            error,
            errorInfo,
        });

        // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
        // Example: Sentry.captureException(error, { extra: errorInfo });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-background p-4">
                    <div className="max-w-md w-full">
                        <div className="bg-card border border-border rounded-xl p-6 sm:p-8 text-center">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                                    <AlertTriangle className="w-8 h-8 text-destructive" />
                                </div>
                            </div>

                            <h1 className="text-2xl font-semibold mb-2">Something went wrong</h1>

                            <p className="text-muted-foreground mb-6">
                                {this.state.error?.message || 'An unexpected error occurred. Please try again.'}
                            </p>

                            {/* Show error details in development */}
                            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                                <details className="mb-6 text-left">
                                    <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground mb-2">
                                        Error Details (Development Only)
                                    </summary>
                                    <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-40">
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                </details>
                            )}

                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Button
                                    onClick={this.handleReset}
                                    variant="outline"
                                    className="gap-2"
                                >
                                    Try Again
                                </Button>
                                <Button
                                    onClick={this.handleReload}
                                    className="gap-2"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Reload Page
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
