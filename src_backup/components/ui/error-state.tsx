import { AlertTriangle } from "lucide-react";
import { Button } from "./button";

interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
}

export function ErrorState({ 
    title = "Something went wrong", 
    message = "We encountered an error while loading this data. Please try again.",
    onRetry 
}: ErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 md:p-12 glass-card text-center border-destructive/20 shadow-[0_0_30px_rgba(244,63,94,0.1)]">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6 text-destructive">
                <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-display font-bold mb-2">{title}</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">{message}</p>
            {onRetry && (
                <Button onClick={onRetry} variant="outline" className="border-destructive/30 hover:bg-destructive/10 hover:text-destructive">
                    Try Again
                </Button>
            )}
        </div>
    );
}
