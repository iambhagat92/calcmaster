import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ruler, Weight, User } from "lucide-react";

const schema = z.object({
  gender: z.enum(["male", "female"]),
  age: z.coerce.number().min(2).max(120),
  height: z.coerce.number().min(50).max(300), // cm
  weight: z.coerce.number().min(10).max(500), // kg
});

type FormValues = z.infer<typeof schema>;

export function BMICalculator() {
  const [result, setResult] = useState<{
    bmi: number;
    category: string;
    color: string;
  } | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      gender: "male",
      age: 25,
      height: 170,
      weight: 70,
    },
  });

  const onSubmit = (data: FormValues) => {
    const heightInMeters = data.height / 100;
    const bmi = data.weight / (heightInMeters * heightInMeters);
    
    let category = "";
    let color = "";

    if (bmi < 18.5) {
      category = "Underweight";
      color = "text-blue-500";
    } else if (bmi < 25) {
      category = "Normal weight";
      color = "text-green-500";
    } else if (bmi < 30) {
      category = "Overweight";
      color = "text-orange-500";
    } else {
      category = "Obese";
      color = "text-red-500";
    }

    setResult({ bmi, category, color });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="shadow-lg border-border/60">
        <CardHeader className="bg-slate-50 border-b border-border/40">
          <CardTitle className="text-xl font-display text-slate-800">Calculate Your BMI</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-4"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="male" />
                          </FormControl>
                          <FormLabel className="font-normal">Male</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="female" />
                          </FormControl>
                          <FormLabel className="font-normal">Female</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (cm)</FormLabel>
                      <div className="relative">
                        <Ruler className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <div className="relative">
                        <Weight className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <FormControl>
                          <Input className="pl-9 input-modern" type="number" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" size="lg" className="w-full text-lg shadow-lg shadow-primary/25 hover:shadow-xl transition-all">
                Calculate BMI
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result ? (
        <Card className="shadow-lg border-primary/20 bg-slate-50/50 flex flex-col justify-center">
          <CardContent className="pt-8 text-center">
            <p className="text-muted-foreground mb-2 font-medium uppercase tracking-wide">Your BMI Score</p>
            <h2 className="text-6xl font-display font-bold text-slate-900 mb-4">
              {result.bmi.toFixed(1)}
            </h2>
            <div className={`text-2xl font-bold mb-8 ${result.color}`}>
              {result.category}
            </div>
            
            <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden flex mb-2">
              <div className="h-full bg-blue-500 w-[18.5%]" />
              <div className="h-full bg-green-500 w-[25%]" />
              <div className="h-full bg-orange-500 w-[16.5%]" />
              <div className="h-full bg-red-500 flex-1" />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Underweight</span>
              <span>Normal</span>
              <span>Overweight</span>
              <span>Obese</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="hidden lg:flex items-center justify-center p-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-300">
          <div className="text-center text-muted-foreground">
            <Ruler className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>Enter your height and weight to see your BMI.</p>
          </div>
        </div>
      )}
    </div>
  );
}
