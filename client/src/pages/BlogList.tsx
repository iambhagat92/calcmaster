import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useBlogPosts } from "@/hooks/use-blog";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogList() {
  const { data: posts, isLoading } = useBlogPosts();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/30">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
            Insights & Guides
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Expert articles to help you understand the numbers behind your life decisions.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[400px] rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts?.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group h-full">
                <Card className="h-full border-border hover:shadow-lg hover:border-primary/30 transition-all duration-300 flex flex-col">
                  {/* Stock Image Placeholder - Replace with dynamic if available */}
                  <div className="h-48 bg-slate-200 w-full relative overflow-hidden rounded-t-xl">
                    {/* Unsplash image for blog placeholder */}
                    <img 
                      src={`https://images.unsplash.com/photo-1554224155-984063584d45?auto=format&fit=crop&w=800&q=80`} 
                      alt="Blog cover" 
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">Finance</Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {post.publishedAt ? format(new Date(post.publishedAt), 'MMM d, yyyy') : 'Draft'}
                      </span>
                    </div>
                    <CardTitle className="font-display text-xl group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-slate-600 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read Article <ArrowRight className="h-4 w-4" />
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
