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
        <div className="min-h-screen bg-background pb-20">
            {/* Header / Hero Section */}
            <div className="bg-muted/30 py-16 md:py-20 border-b border-border/50">
                <div className="container mx-auto px-4 text-center max-w-3xl">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                        Explore <span className="gradient-text">Categories</span>
                    </h1>
                    <p className="text-muted-foreground text-lg mb-8">
                        Find expert tutors across hundreds of subjects. Whether you're looking to ace your exams or learn a new skill, we have the right category for you.
                    </p>
                    
                    {/* Search Form (Server component using native form) */}
                    <form action="/categories" method="GET" className="relative max-w-md mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input 
                            name="q"
                            defaultValue={searchParams?.q || ""}
                            placeholder="Search subjects or categories..." 
                            className="bg-background rounded-full pl-12 pr-4 h-14 text-base shadow-sm border-border/50 focus-visible:ring-primary/20"
                        />
                    </form>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="container mx-auto px-4 py-12">
                <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">
                        {query ? `Search results for "${query}"` : "All Categories"}
                    </h2>
                    <p className="text-muted-foreground bg-muted px-3 py-1 rounded-full text-sm font-medium">
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
                    <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border mt-8">
                        <div className="inline-flex w-16 h-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
                            <Search className="w-8 h-8 opacity-50" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No categories found</h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            We couldn't find any categories matching "{query}". Try searching with different keywords or browse all categories.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
