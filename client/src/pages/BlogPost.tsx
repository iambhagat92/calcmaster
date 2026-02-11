import { useRoute, Link } from "wouter";
import { Helmet } from "react-helmet";
import { format } from "date-fns";
import { useBlogPost } from "@/hooks/use-blog";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, ArrowLeft, User } from "lucide-react";

export default function BlogPost() {
  const [match, params] = useRoute("/blog/:slug");
  const slug = params?.slug || "";
  const { data: post, isLoading, error } = useBlogPost(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <Skeleton className="h-8 w-24 mb-6" />
          <Skeleton className="h-16 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-12" />
          <Skeleton className="h-96 w-full rounded-2xl mb-12" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-display font-bold mb-4">Article Not Found</h1>
          <Link href="/blog">
            <a className="text-primary hover:underline">Back to Blog</a>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <title>{post.metaTitle || post.title}</title>
        <meta name="description" content={post.metaDescription || post.excerpt} />
      </Helmet>

      <Header />

      <main className="flex-1">
        <article className="container mx-auto px-4 py-16 max-w-4xl">
          <Link href="/blog" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
          </Link>

          <header className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                Article
              </Badge>
              <span className="text-sm text-slate-500 flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                {post.publishedAt ? format(new Date(post.publishedAt), 'MMMM d, yyyy') : 'Draft'}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-slate-900 leading-tight mb-6">
              {post.title}
            </h1>
            
            <p className="text-xl text-slate-600 leading-relaxed border-l-4 border-primary/20 pl-6 italic">
              {post.excerpt}
            </p>
          </header>

          <div className="w-full h-[400px] rounded-2xl overflow-hidden mb-12 shadow-lg">
             {/* Unsplash image for blog hero */}
            <img 
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80" 
              alt="Blog Hero" 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="prose prose-lg prose-slate max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          <hr className="my-12 border-slate-200" />

          <div className="bg-slate-50 rounded-2xl p-8 flex items-center gap-6">
            <div className="h-16 w-16 bg-slate-200 rounded-full flex items-center justify-center shrink-0">
              <User className="h-8 w-8 text-slate-400" />
            </div>
            <div>
              <p className="font-bold text-slate-900 mb-1">Written by The CalcMaster Team</p>
              <p className="text-slate-600">
                Our team of financial experts and data scientists works to bring you accurate and helpful tools for everyday life.
              </p>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
