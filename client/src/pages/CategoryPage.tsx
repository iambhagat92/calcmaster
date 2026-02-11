import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import NotFound from "./not-found";
import { Helmet } from "react-helmet";

export default function CategoryPage() {
    const [match, params] = useRoute("/:category");
    const categorySlug = match ? params.category : null;

    const { data: categories, isLoading } = useQuery({
        queryKey: [api.categories.list.path],
        queryFn: async () => {
            const res = await fetch(api.categories.list.path);
            if (!res.ok) throw new Error("Failed to fetch categories");
            return res.json();
        }
    });

    if (isLoading) {
        return <div className="container py-8">Loading...</div>;
    }

    const category = categories?.find((c: any) => c.slug === categorySlug);

    if (!category) {
        return <NotFound />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Helmet>
                <title>{category.name} - CalcMaster</title>
                <meta name="description" content={category.description || `Free online ${category.name} calculators.`} />
            </Helmet>

            <h1 className="text-4xl font-bold mb-4 capitalize">{category.name}</h1>
            <p className="text-xl text-muted-foreground mb-8">{category.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.calculators?.map((calc: any) => (
                    <Link key={calc.id} href={`/${category.slug}/${calc.slug}`}>
                        <a className="block h-full">
                            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                                <CardHeader>
                                    <CardTitle>{calc.name}</CardTitle>
                                    <CardDescription>{calc.description}</CardDescription>
                                </CardHeader>
                            </Card>
                        </a>
                    </Link>
                ))}
            </div>
        </div>
    );
}
