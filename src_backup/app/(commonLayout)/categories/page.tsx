import { getCategories } from "@/lib/actions/category.actions";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Browse Categories | SkillBridge",
    description: "Explore all tutoring subjects and categories available on SkillBridge.",
};

export default async function CategoriesPage(props: { searchParams: Promise<{ q?: string }> }) {
    // Await searchParams as required in Next.js 15
    const searchParams = await props.searchParams;
    const query = searchParams?.q?.toLowerCase() || "";
    
    // Fetch all active categories
    const allCategories = await getCategories();
    
    // Process search query on the server side
    const categories = allCategories.filter((c) => 
        c.name.toLowerCase().includes(query) || 
        (c.description?.toLowerCase() || "").includes(query)
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] pb-24">
            {/* Header / Hero Section */}
            <div className="py-24 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a]/60">
                <div className="container mx-auto px-4 text-center max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-[#6366f1] text-[13px] font-medium mb-6">
                        <Search className="w-3.5 h-3.5" /> Explore Subjects
                    </div>
                    <h1 className="text-[40px] md:text-[56px] font-medium mb-6 tracking-tight leading-[1.1] text-slate-900 dark:text-slate-50">
                        Find the perfect <span className="text-[#6366f1]">category</span>
                    </h1>
                    <p className="text-[16px] text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-[1.7]">
                        From mathematics to programming, discover expert tutors across hundreds of subjects. Whether you're looking to ace your exams or learn a new skill, we have the right fit for you.
                    </p>
                    
                    {/* Search Form */}
                    <form action="/categories" method="GET" className="relative max-w-xl mx-auto group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#6366f1] transition-colors" />
                        <Input 
                            name="q"
                            defaultValue={searchParams?.q || ""}
                            placeholder="Search subjects or categories..." 
                            className="w-full bg-[#f8fafc] dark:bg-[#0f172a] rounded-[16px] pl-14 pr-6 h-16 text-[16px] border-slate-200 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-[#6366f1] shadow-sm transition-all"
                        />
                    </form>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="container mx-auto px-4 py-16">
                <div className="mb-10 flex items-center justify-between">
                    <h2 className="text-[28px] font-medium text-slate-900 dark:text-slate-50">
                        {query ? `Search results for "${query}"` : "All Categories"}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 px-4 py-1.5 rounded-full text-[13px] font-medium">
                        {categories.length} {categories.length === 1 ? 'Category' : 'Categories'}
                    </p>
                </div>

                {categories.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {categories.map((category) => (
                            <CategoryCard key={category.id} category={category} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white dark:bg-[#0f172a]/40 rounded-[24px] border border-dashed border-slate-300 dark:border-slate-700 mt-8">
                        <div className="inline-flex w-16 h-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-6">
                            <Search className="w-8 h-8" />
                        </div>
                        <h3 className="text-[20px] font-medium text-slate-900 dark:text-slate-50 mb-3">No categories found</h3>
                        <p className="text-[16px] text-slate-500 max-w-md mx-auto leading-[1.7]">
                            We couldn't find any categories matching "{query}". Try searching with different keywords or browse all categories.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
