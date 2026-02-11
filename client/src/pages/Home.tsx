import { Link } from "wouter";
import { useCategories } from "@/hooks/use-calculators";
import { ArrowRight, Calculator, PieChart, TrendingUp, Heart } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: categories, isLoading } = useCategories();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/30">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-32 bg-white">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white" />
        <div className="container relative mx-auto px-4 text-center z-10">
          <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight text-slate-900 mb-6 drop-shadow-sm">
            Calculations Made <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Simple</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Professional-grade calculators for finance, health, math, and more.
            Accurate, fast, and completely free to use.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/20 hover:shadow-2xl hover:-translate-y-1 transition-all">
              Explore Calculators
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-slate-300 hover:bg-slate-50">
              Read Our Blog
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="py-20 container mx-auto px-4" id="categories">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-display font-bold text-slate-900">Browse by Category</h2>
          <Button variant="ghost" className="gap-2">
            View All <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories?.map((category) => (
              <div key={category.id} className="group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 group-hover:border-primary/30 group-hover:shadow-md transition-all">
                    {/* Icon mapping could be improved based on category slug */}
                    {category.slug === 'financial' ? <TrendingUp className="h-6 w-6 text-blue-600" /> :
                     category.slug === 'health' ? <Heart className="h-6 w-6 text-red-500" /> :
                     <Calculator className="h-6 w-6 text-primary" />}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{category.name}</h3>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                  <p className="text-slate-500 mb-6 line-clamp-2 h-12">
                    {category.description || `Essential ${category.name.toLowerCase()} calculators for everyday use.`}
                  </p>
                  <div className="space-y-3">
                    {category.calculators.slice(0, 4).map((calc) => (
                      <Link 
                        key={calc.id} 
                        href={`/calculators/${calc.slug}`}
                        className="flex items-center justify-between group/link p-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <span className="font-medium text-slate-700 group-hover/link:text-primary transition-colors">
                          {calc.name}
                        </span>
                        <ArrowRight className="h-4 w-4 text-slate-300 group-hover/link:text-primary transition-colors opacity-0 group-hover/link:opacity-100" />
                      </Link>
                    ))}
                    {category.calculators.length > 4 && (
                      <div className="pt-2">
                        <span className="text-sm text-primary font-medium hover:underline cursor-pointer">
                          +{category.calculators.length - 4} more calculators
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900 text-white py-24 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Need something specific?</h2>
          <p className="text-slate-300 max-w-2xl mx-auto mb-10 text-lg">
            We're constantly adding new calculators. Check out our blog for tips, tricks, and detailed guides on how to make the most of your finances and health.
          </p>
          <Link href="/blog">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 shadow-xl shadow-white/5 border-none h-14 px-8 text-lg rounded-full">
              Visit Our Blog
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
