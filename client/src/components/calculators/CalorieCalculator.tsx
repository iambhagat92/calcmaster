import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Activity, Flame, Utensils } from "lucide-react";

const schema = z.object({
    gender: z.enum(["male", "female"]),
    age: z.coerce.number().min(10).max(100),
    height: z.coerce.number().min(50).max(250), // cm
    weight: z.coerce.number().min(20).max(300), // kg
    activity: z.enum(["sedentary", "light", "moderate", "active", "very_active"]),
});

type FormValues = z.infer<typeof schema>;

const ACTIVITY_MULTIPLIERS = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
};

export function CalorieCalculator() {
    const [result, setResult] = useState<{
        bmr: number;
        tdee: number;
        goals: {
            loss: number;
            extremeLoss: number;
            gain: number;
            extremeGain: number;
        }
    } | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            gender: "male",
            age: 30,
            height: 175,
            weight: 75,
            activity: "moderate",
        },
    });

    const onSubmit = (data: FormValues) => {
        // Mifflin-St Jeor Equation
        let bmr = (10 * data.weight) + (6.25 * data.height) - (5 * data.age);
        if (data.gender === "male") {
            bmr += 5;
        } else {
            bmr -= 161;
        }

        const tdee = bmr * ACTIVITY_MULTIPLIERS[data.activity];

        setResult({
            bmr: Math.round(bmr),
            tdee: Math.round(tdee),
            goals: {
                loss: Math.round(tdee - 500),
                extremeLoss: Math.round(tdee - 1000),
                gain: Math.round(tdee + 500),
                extremeGain: Math.round(tdee + 1000),
            }
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Calculate Your Daily Needs</CardTitle>
                </CardHeader>
                <CardContent>
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
                                                <FormItem className="flex items-center space-x-2">
                                                    <FormControl><RadioGroupItem value="male" /></FormControl>
                                                    <FormLabel className="font-normal">Male</FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-2">
                                                    <FormControl><RadioGroupItem value="female" /></FormControl>
                                                    <FormLabel className="font-normal">Female</FormLabel>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-3 gap-4">
                                <FormField control={form.control} name="age" render={({ field }) => (
                                    <FormItem><FormLabel>Age</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="height" render={({ field }) => (
                                    <FormItem><FormLabel>Height (cm)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="weight" render={({ field }) => (
                                    <FormItem><FormLabel>Weight (kg)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                                )} />
                            </div>

                            <FormField
                                control={form.control}
                                name="activity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Activity Level</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select activity level" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="sedentary">Sedentary (office job)</SelectItem>
                                                <SelectItem value="light">Light Activity (1-2 days/week)</SelectItem>
                                                <SelectItem value="moderate">Moderate Activity (3-5 days/week)</SelectItem>
                                                <SelectItem value="active">Active (6-7 days/week)</SelectItem>
                                                <SelectItem value="very_active">Very Active (physical job)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full">Calculate Calories</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {result ? (
                <Card className="bg-slate-50">
                    <CardHeader>
                        <CardTitle>Your Results</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-100 text-center">
                                <p className="text-xs text-muted-foreground uppercase mb-1">BMR (Basal Rate)</p>
                                <p className="text-2xl font-bold">{result.bmr}</p>
                                <p className="text-xs text-muted-foreground">Calories/day</p>
                            </div>
                            <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-100 text-center">
                                <p className="text-xs text-muted-foreground uppercase mb-1">TDEE (Maintenance)</p>
                                <p className="text-2xl font-bold text-primary">{result.tdee}</p>
                                <p className="text-xs text-muted-foreground">Calories/day</p>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <h4 className="font-semibold flex items-center gap-2">
                                <Utensils className="h-4 w-4" /> Weight Goals
                            </h4>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-white rounded-md border-l-4 border-green-500 shadow-sm">
                                    <span className="text-sm">Maintain Weight</span>
                                    <span className="font-bold">{result.tdee} kcal</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white rounded-md border-l-4 border-yellow-500 shadow-sm">
                                    <span className="text-sm">Mild Weight Loss (-0.5kg/week)</span>
                                    <span className="font-bold">{result.goals.loss} kcal</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white rounded-md border-l-4 border-orange-500 shadow-sm">
                                    <span className="text-sm">Weight Loss (-1kg/week)</span>
                                    <span className="font-bold">{result.goals.extremeLoss} kcal</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white rounded-md border-l-4 border-blue-500 shadow-sm">
                                    <span className="text-sm">Weight Gain (+0.5kg/week)</span>
                                    <span className="font-bold">{result.goals.gain} kcal</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="hidden lg:flex items-center justify-center p-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-300">
                    <div className="text-center text-muted-foreground">
                        <Flame className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>Enter your details to calculate your daily calorie needs.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
