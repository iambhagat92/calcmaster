import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
      <div className="text-center space-y-6 p-8">
        <div className="flex justify-center">
          <div className="bg-red-100 p-4 rounded-full">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>
        </div>
        <h1 className="text-4xl font-display font-bold text-slate-900">Page Not Found</h1>
        <p className="text-lg text-slate-600 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link href="/">
          <Button size="lg" className="mt-4">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
