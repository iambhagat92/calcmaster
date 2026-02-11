import { Link } from "wouter";
import { Calculator, Twitter, Github, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Calculator className="h-5 w-5 text-primary" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">
                Calc<span className="text-primary">Master</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Professional, accurate, and free online calculators for finance, health, science, and more. 
              Making complex calculations simple.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold text-slate-900 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-muted-foreground hover:text-primary">Home</Link></li>
              <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-primary">Blog & Articles</Link></li>
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-slate-900 mb-4">Popular Calculators</h3>
            <ul className="space-y-3">
              <li><Link href="/calculators/mortgage-calculator" className="text-sm text-muted-foreground hover:text-primary">Mortgage Calculator</Link></li>
              <li><Link href="/calculators/bmi-calculator" className="text-sm text-muted-foreground hover:text-primary">BMI Calculator</Link></li>
              <li><Link href="/calculators/loan-calculator" className="text-sm text-muted-foreground hover:text-primary">Loan Calculator</Link></li>
              <li><Link href="/calculators/calorie-calculator" className="text-sm text-muted-foreground hover:text-primary">Calorie Calculator</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-slate-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link></li>
              <li><Link href="/disclaimer" className="text-sm text-muted-foreground hover:text-primary">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CalcMaster. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-xs text-muted-foreground">Made with precision and care.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
