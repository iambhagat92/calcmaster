import { MortgageCalculator } from "./MortgageCalculator";
import { BMICalculator } from "./BMICalculator";
// Import other calculators...

interface CalculatorWrapperProps {
  slug: string;
}

export function CalculatorWrapper({ slug }: CalculatorWrapperProps) {
  switch (slug) {
    case "mortgage-calculator":
      return <MortgageCalculator />;
    case "bmi-calculator":
      return <BMICalculator />;
    // Add cases for other calculators:
    // case "loan-calculator": return <LoanCalculator />;
    // case "calorie-calculator": return <CalorieCalculator />;
    default:
      return (
        <div className="p-12 text-center bg-slate-50 rounded-xl border border-dashed">
          <h3 className="text-lg font-medium text-slate-900">Calculator Coming Soon</h3>
          <p className="text-muted-foreground mt-2">
            The {slug.replace(/-/g, " ")} is currently under development.
          </p>
        </div>
      );
  }
}
