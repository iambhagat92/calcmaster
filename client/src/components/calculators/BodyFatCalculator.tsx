import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

const schema = z.object({
    gender: z.enum(["male", "female"]),
    age: z.coerce.number().min(10).max(100),
    height: z.coerce.number().min(50).max(250),
    waist: z.coerce.number().min(20).max(200),
    neck: z.coerce.number().min(10).max(100),
    hip: z.coerce.number().optional(),
});

type FormValues = z.infer<typeof schema>;

export function BodyFatCalculator() {
    const [bodyFat, setBodyFat] = useState<number | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            gender: "male",
            age: 25,
            height: 175,
            weight: 75, // Note: weight not strictly needed for Navy method body fat %, but good context
            waist: 85,
            neck: 38,
            hip: 95,
        } as any, // casting to allow unused weight if needed in future
    });

    const gender = form.watch("gender");

    const onSubmit = (data: FormValues) => {
        // U.S. Navy Method
        let bf = 0;

        if (data.gender === "male") {
            // 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
            const logWaistNeck = Math.log10(data.waist - data.neck);
            const logHeight = Math.log10(data.height);
            bf = 495 / (1.0324 - 0.19077 * logWaistNeck + 0.15456 * logHeight) - 450;
        } else {
            // 495 / (1.29579 - 0.35004 * log10(waist + hip - neck) + 0.22100 * log10(height)) - 450
            const hip = data.hip || data.waist; // Fallback
            const logWaistHipNeck = Math.log10(data.waist + hip - data.neck);
            const logHeight = Math.log10(data.height);
            bf = 495 / (1.29579 - 0.35004 * logWaistHipNeck + 0.22100 * logHeight) - 450;
        }

        setBodyFat(Math.max(2, Math.min(bf, 70))); // Clamp results
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
                <CardHeader><CardTitle>Body Fat Percentage (Navy Method)</CardTitle></CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="male" /></FormControl><FormLabel className="font-normal">Male</FormLabel></FormItem>
                                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="female" /></FormControl><FormLabel className="font-normal">Female</FormLabel></FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="age" render={({ field }) => (
                                    <FormItem><FormLabel>Age</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="height" render={({ field }) => (
                                    <FormItem><FormLabel>Height (cm)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                                )} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="waist" render={({ field }) => (
                                    <FormItem><FormLabel>Waist (cm)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="neck" render={({ field }) => (
                                    <FormItem><FormLabel>Neck (cm)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                                )} />
                            </div>

                            {gender === "female" && (
                                <FormField control={form.control} name="hip" render={({ field }) => (
                                    <FormItem><FormLabel>Hip (cm)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                                )} />
                            )}

                            <Button type="submit" className="w-full">Calculate Body Fat</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {bodyFat !== null ? (
                <Card className="bg-slate-50 flex items-center justify-center">
                    <CardContent className="text-center pt-6">
                        <p className="text-muted-foreground uppercase text-xs font-bold tracking-wider mb-2">Estimated Body Fat</p>
                        <div className="text-6xl font-black text-primary mb-4">
                            {bodyFat.toFixed(1)}<span className="text-3xl">%</span>
                        </div>
                        <div className="inline-block px-4 py-1 rounded-full bg-white border border-slate-200 text-sm">
                            {bodyFat < 6 ? "Essential Fat" : bodyFat < 14 ? "Athletes" : bodyFat < 18 ? "Fitness" : bodyFat < 25 ? "Average" : "Obese"}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="hidden lg:flex items-center justify-center p-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-300">
                    <div className="text-center text-muted-foreground">
                        <Activity className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>Fill in your measurements to estimate your body fat percentage.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
