import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { DollarSign, Percent, Calendar, Calculator } from "lucide-react";

const schema = z.object({
  homePrice: z.coerce.number().min(1000, "Price must be at least $1,000"),
  downPayment: z.coerce.number().min(0, "Down payment cannot be negative"),
  interestRate: z.coerce.number().min(0.1, "Interest rate must be > 0").max(20, "Rate seems too high"),
  loanTerm: z.coerce.number().min(1, "Term must be at least 1 year").max(50, "Term max is 50 years"),
});

type FormValues = z.infer<typeof schema>;

export function MortgageCalculator() {
  const [result, setResult] = useState<{
    monthlyPayment: number;
    totalInterest: number;
    totalPayment: number;
  } | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      homePrice: 300000,
      downPayment: 60000,
      interestRate: 6.5,
      loanTerm: 30,
    },
  });

  const onSubmit = (data: FormValues) => {
    const principal = data.homePrice - data.downPayment;
    const monthlyRate = data.interestRate / 100 / 12;
    const numberOfPayments = data.loanTerm * 12;

    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;

    setResult({
      monthlyPayment,
      totalInterest,
      totalPayment,
    });
  };

  const chartData = result ? [
    { name: "Principal", value: form.getValues().homePrice - form.getValues().downPayment },
    { name: "Interest", value: result.totalInterest },
  ] : [];

  const COLORS = ["#3b82f6", "#ef4444"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="shadow-lg border-border/60">
        <CardHeader className="bg-slate-50 border-b border-border/40">
          <CardTitle className="text-xl font-display text-slate-800">Calculate Your Payment</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="homePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Home Price</FormLabel>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input className="pl-9 input-modern" type="number" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="downPayment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Down Payment</FormLabel>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <FormControl>
                          <Input className="pl-9 input-modern" type="number" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="interestRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interest Rate</FormLabel>
                      <div className="relative">
                        <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <FormControl>
                          <Input className="pl-9 input-modern" type="number" step="0.1" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="loanTerm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Term (Years)</FormLabel>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input className="pl-9 input-modern" type="number" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" size="lg" className="w-full text-lg shadow-lg shadow-primary/25 hover:shadow-xl transition-all">
                Calculate Payment
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result ? (
        <Card className="shadow-lg border-primary/20 bg-slate-50/50">
          <CardHeader className="border-b border-border/40">
            <CardTitle className="text-xl font-display text-slate-800">Your Results</CardTitle>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="text-center mb-8">
              <p className="text-muted-foreground mb-1 font-medium uppercase tracking-wide text-xs">Monthly Payment</p>
              <h2 className="text-5xl font-display font-bold text-primary">
                ${result.monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                <p className="text-xs text-muted-foreground mb-1">Total Interest</p>
                <p className="text-lg font-bold text-destructive">
                  ${result.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                <p className="text-xs text-muted-foreground mb-1">Total Cost</p>
                <p className="text-lg font-bold text-slate-900">
                  ${result.totalPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span>Principal</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span>Interest</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="hidden lg:flex items-center justify-center p-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-300">
          <div className="text-center text-muted-foreground">
            <Calculator className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>Enter your details and hit calculate to see the breakdown.</p>
          </div>
        </div>
      )}
    </div>
  );
}
