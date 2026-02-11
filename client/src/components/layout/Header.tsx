import { Link, useLocation } from "wouter";
import { Calculator, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCategories } from "@/hooks/use-calculators";
import { Search } from "@/components/Search";

export function Header() {
  const [location] = useLocation();
  const { data: categories } = useCategories();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Calculators", href: "/#categories" },
    { name: "Blog", href: "/blog" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Calculator className="h-6 w-6 text-primary" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground">
              Calc<span className="text-primary">Master</span>
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${location === item.href ? "text-primary" : "text-muted-foreground"
                }`}
            >
              {item.name}
            </Link>
          ))}
          <Search />
          <Button size="sm" className="shadow-lg shadow-primary/20">
            Get Started
          </Button>
        </nav>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 mt-6">
                <div className="flex flex-col gap-2">
                  <h3 className="font-display font-bold text-lg mb-2">Navigation</h3>
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-lg font-medium py-2 hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {categories && (
                  <div className="flex flex-col gap-2">
                    <h3 className="font-display font-bold text-lg mb-2">Categories</h3>
                    {categories.map((cat) => (
                      <div key={cat.id} className="py-1">
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                          {cat.name}
                        </span>
                        <div className="pl-4 flex flex-col gap-2 border-l border-border">
                          {cat.calculators.map((calc) => (
                            <Link
                              key={calc.id}
                              href={`/calculators/${calc.slug}`}
                              className="text-sm text-foreground hover:text-primary transition-colors"
                              onClick={() => setIsOpen(false)}
                            >
                              {calc.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
