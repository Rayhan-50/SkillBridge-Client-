import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
    title: string;
    value: string | number;
    sub: string;
    icon: LucideIcon;
    colorClass?: string;
    trend?: "up" | "down" | "neutral";
    loading?: boolean;
}

export function StatCard({ title, value, sub, icon: Icon, colorClass = "from-primary to-accent", trend, loading }: StatCardProps) {
    return (
        <div className="glass-card overflow-hidden group relative">
            <div className={cn("absolute top-0 left-0 w-full h-1 bg-gradient-to-r", colorClass)} />
            <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-inner", colorClass)}>
                        <Icon className="h-5 w-5 text-white" />
                    </div>
                </div>
                <div>
                    {loading ? (
                        <div className="h-8 w-24 skeleton-neon rounded mb-1" />
                    ) : (
                        <div className="text-3xl font-display font-bold tracking-tight text-foreground">{value}</div>
                    )}
                    
                    <div className="flex items-center gap-2 mt-2">
                        {trend === "up" && (
                            <span className="badge-green text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">↗ Trend</span>
                        )}
                        {trend === "down" && (
                            <span className="badge-red text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">↘ Trend</span>
                        )}
                        <p className="text-xs text-muted-foreground">{sub}</p>
                    </div>
                </div>
            </div>
            {/* Hover glow effect */}
            <div className={cn("absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br rounded-full blur-[50px] opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none", colorClass)} />
        </div>
    );
}
