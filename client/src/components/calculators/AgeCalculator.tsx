import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { differenceInYears, differenceInMonths, differenceInDays } from "date-fns";
import { Calendar } from "lucide-react";

export function AgeCalculator() {
    const [dob, setDob] = useState("");
    const [result, setResult] = useState<{ years: number; months: number; days: number } | null>(null);

    const calculate = () => {
        if (!dob) return;
        const birthDate = new Date(dob);
        const today = new Date();

        if (birthDate > today) return;

        // Simple calculation using date-fns or native JS
        // date-fns difference functions are whole intervals
        let years = differenceInYears(today, birthDate);
        let tempDate = new Date(birthDate);
        tempDate.setFullYear(tempDate.getFullYear() + years);

        let months = differenceInMonths(today, tempDate);
        tempDate.setMonth(tempDate.getMonth() + months);

        let days = differenceInDays(today, tempDate);

        setResult({ years, months, days });
    };

    return (
        <Card className="max-w-md mx-auto">
            <CardHeader><CardTitle>Age Calculator</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                </div>

                <Button onClick={calculate} className="w-full">Calculate Age</Button>

                {result && (
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-blue-50 text-blue-900 rounded-lg">
                            <div className="text-3xl font-bold">{result.years}</div>
                            <div className="text-xs uppercase tracking-wider">Years</div>
                        </div>
                        <div className="p-4 bg-green-50 text-green-900 rounded-lg">
                            <div className="text-3xl font-bold">{result.months}</div>
                            <div className="text-xs uppercase tracking-wider">Months</div>
                        </div>
                        <div className="p-4 bg-orange-50 text-orange-900 rounded-lg">
                            <div className="text-3xl font-bold">{result.days}</div>
                            <div className="text-xs uppercase tracking-wider">Days</div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
