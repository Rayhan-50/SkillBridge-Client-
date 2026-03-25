import { ReactNode } from "react";

interface PageHeaderProps {
    title: string;
    description?: string;
    action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-border/50">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight gradient-text">{title}</h1>
                {description && (
                    <p className="text-muted-foreground mt-1.5 text-sm">{description}</p>
                )}
            </div>
            {action && <div className="mt-4 md:mt-0">{action}</div>}
        </div>
    );
}
