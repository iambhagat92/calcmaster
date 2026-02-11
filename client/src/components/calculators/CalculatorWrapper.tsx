import { MortgageCalculator } from "./MortgageCalculator";
import { BMICalculator } from "./BMICalculator";
import { LoanCalculator } from "./LoanCalculator";
import { InvestmentCalculator } from "./InvestmentCalculator";
import { AutoLoanCalculator } from "./AutoLoanCalculator";
import { CompoundInterestCalculator } from "./CompoundInterestCalculator";
import { RetirementCalculator } from "./RetirementCalculator";
import { CalorieCalculator } from "./CalorieCalculator";
import { BodyFatCalculator } from "./BodyFatCalculator";
import { PregnancyCalculator } from "./PregnancyCalculator";
import { ScientificCalculator } from "./ScientificCalculator";
import { StatisticsCalculator } from "./StatisticsCalculator";
import { PercentageCalculator } from "./PercentageCalculator";
import { ConcreteCalculator } from "./ConcreteCalculator";
import { PaintCalculator } from "./PaintCalculator";
import { UnitConverter } from "./UnitConverter";
import { GPACalculator } from "./GPACalculator";
import { GradeCalculator } from "./GradeCalculator";
import { AgeCalculator } from "./AgeCalculator";
import { DateCalculator } from "./DateCalculator";
import { BandwidthCalculator } from "./BandwidthCalculator";
import { FileSizeCalculator } from "./FileSizeCalculator";
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
    case "loan-calculator":
      return <LoanCalculator />;
    case "investment-calculator":
      return <InvestmentCalculator />;
    case "auto-loan-calculator":
      return <AutoLoanCalculator />;
    case "compound-interest-calculator":
      return <CompoundInterestCalculator />;
    case "retirement-calculator":
      return <RetirementCalculator />;
    case "calorie-calculator":
      return <CalorieCalculator />;
    case "body-fat-calculator":
      return <BodyFatCalculator />;
    case "pregnancy-calculator":
      return <PregnancyCalculator />;
    case "scientific-calculator":
      return <ScientificCalculator />;
    case "statistics-calculator":
      return <StatisticsCalculator />;
    case "percentage-calculator":
      return <PercentageCalculator />;
    case "concrete-calculator":
      return <ConcreteCalculator />;
    case "paint-calculator":
      return <PaintCalculator />;
    case "unit-converter":
      return <UnitConverter />;
    case "gpa-calculator":
      return <GPACalculator />;
    case "grade-calculator":
      return <GradeCalculator />;
    case "age-calculator":
      return <AgeCalculator />;
    case "date-calculator":
      return <DateCalculator />;
    case "bandwidth-calculator":
      return <BandwidthCalculator />;
    case "file-size-calculator":
      return <FileSizeCalculator />;
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
