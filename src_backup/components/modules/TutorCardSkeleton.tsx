import { Skeleton } from "@/components/ui/skeleton";

export function TutorCardSkeleton() {
  return (
    <div className="flex flex-col h-full bg-[#f8fafc] dark:bg-[#0f172a]/40 border border-slate-200 dark:border-slate-800 rounded-[16px] overflow-hidden">
        <div className="p-6 flex flex-col flex-1">
            <div className="flex items-start gap-4 mb-5">
                <Skeleton className="h-[64px] w-[64px] rounded-full shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                    <Skeleton className="h-[20px] w-3/4" />
                    <Skeleton className="h-[14px] w-1/3" />
                </div>
            </div>
            
            <div className="space-y-2 mb-6">
                <Skeleton className="h-[16px] w-full" />
                <Skeleton className="h-[16px] w-full" />
                <Skeleton className="h-[16px] w-4/5" />
            </div>
            
            <div className="flex flex-wrap gap-2 mt-auto">
                <Skeleton className="h-[26px] w-[64px] rounded-[999px]" />
                <Skeleton className="h-[26px] w-[80px] rounded-[999px]" />
                <Skeleton className="h-[26px] w-[56px] rounded-[999px]" />
            </div>
        </div>
        
        <div className="px-6 py-5 border-t border-slate-200 dark:border-slate-800 bg-[#f8fafc] dark:bg-[#0f172a]/60 flex items-center justify-between">
            <Skeleton className="h-[20px] w-[64px]" />
            <Skeleton className="h-9 w-[96px] rounded-[8px]" />
        </div>
    </div>
  );
}

export function TutorGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <TutorCardSkeleton key={i} />
      ))}
    </div>
  );
}
