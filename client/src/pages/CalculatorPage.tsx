import { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { Helmet } from "react-helmet";
import { useCalculator } from "@/hooks/use-calculators";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CalculatorWrapper } from "@/components/calculators/CalculatorWrapper";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";

export default function CalculatorPage() {
  const [match, params] = useRoute("/:category/:slug");
  const slug = params?.slug || "";
  const categorySlug = params?.category || "";
  const { data: calculator, isLoading, error } = useCalculator(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/30">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-12 w-3/4 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Skeleton className="h-[500px] w-full rounded-2xl" />
            <Skeleton className="h-[500px] w-full rounded-2xl" />
          </div>
          <Skeleton className="h-8 w-1/3 mb-4" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error || !calculator) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-display font-bold mb-4">Calculator Not Found</h1>
          <p className="text-muted-foreground mb-8">The calculator you are looking for does not exist.</p>
          <Link href="/">
            <a className="text-primary hover:underline">Return Home</a>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/30">
      <Helmet>
        <title>{calculator.metaTitle}</title>
        <meta name="description" content={calculator.metaDescription} />
        {calculator.schemaMarkup && (
          <script type="application/ld+json">
            {JSON.stringify(calculator.schemaMarkup)}
          </script>
        )}
        {calculator.faqs && calculator.faqs.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": calculator.faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer
                }
              }))
            })}
          </script>
        )}
      </Helmet>

      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 lg:py-12">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/${categorySlug}`}>{calculator.category?.name || "Calculators"}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{calculator.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="mb-10 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
            {calculator.name}
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            {calculator.description}
          </p>
        </div>

        {/* The Interactive Tool */}
        <section className="mb-20">
          <CalculatorWrapper slug={slug} />
        </section>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <section className="prose prose-slate prose-lg max-w-none mb-16">
              <div dangerouslySetInnerHTML={{ __html: calculator.content }} />
            </section>

            {/* FAQs */}
            {calculator.faqs && calculator.faqs.length > 0 && (
              <section className="mb-16">
                <h2 className="text-3xl font-display font-bold text-slate-900 mb-8">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                  {calculator.faqs.map((faq) => (
                    <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                      <AccordionTrigger className="text-lg font-semibold text-slate-800">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-slate-600 text-base leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="font-display font-bold text-lg mb-4">Related Calculators</h3>
              <ul className="space-y-3">
                {calculator.category?.calculators
                  ?.filter(c => c.slug !== calculator.slug)
                  .map(c => (
                    <li key={c.id}>
                      <Link href={`/${calculator.category!.slug}/${c.slug}`} className="flex items-center text-slate-600 hover:text-primary transition-colors group">
                        <ChevronRight className="h-4 w-4 mr-2 text-slate-300 group-hover:text-primary" />
                        {c.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>

            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
              <h3 className="font-display font-bold text-lg mb-2 text-primary">Need Help?</h3>
              <p className="text-sm text-slate-600 mb-4">
                Not sure which calculator to use? Read our comprehensive guide on financial planning.
              </p>
              <Link href="/blog/financial-planning-guide">
                <span className="text-sm font-bold text-primary hover:underline cursor-pointer">Read Guide →</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
