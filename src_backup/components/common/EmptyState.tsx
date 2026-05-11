import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: ReactNode;
    className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className = "" }: EmptyStateProps) {
    return (
        <div className={`flex flex-col items-center justify-center py-16 px-4 text-center border border-border/50 rounded-2xl bg-muted/20 ${className}`}>
            <div className="w-16 h-16 rounded-2xl gradient-btn shadow-md flex items-center justify-center mb-5">
                <Icon className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-lg font-bold mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm max-w-xs mb-6">{description}</p>
            {action && action}
        </div>
    );
}
