import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function GradeCalculator() {
    const [currentGrade, setCurrentGrade] = useState<string>("");
    const [wantedGrade, setWantedGrade] = useState<string>("");
    const [finalWeight, setFinalWeight] = useState<string>("50");
    const [result, setResult] = useState<string | null>(null);

    const calculate = () => {
        const current = parseFloat(currentGrade);
        const target = parseFloat(wantedGrade);
        const weight = parseFloat(finalWeight);

        if (isNaN(current) || isNaN(target) || isNaN(weight)) return;

        // Formula: Final = (Target - Current * (1 - Weight/100)) / (Weight/100)
        const required = (target - current * (1 - weight / 100)) / (weight / 100);

        setResult(required.toFixed(2));
    };

    return (
        <Card className="max-w-md mx-auto">
            <CardHeader><CardTitle>Final Grade Calculator</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Current Grade (%)</Label>
                    <Input type="number" value={currentGrade} onChange={(e) => setCurrentGrade(e.target.value)} placeholder="e.g. 85" />
                </div>
                <div className="space-y-2">
                    <Label>Target Grade (%)</Label>
                    <Input type="number" value={wantedGrade} onChange={(e) => setWantedGrade(e.target.value)} placeholder="e.g. 90" />
                </div>
                <div className="space-y-2">
                    <Label>Final Exam Weight (%)</Label>
                    <Input type="number" value={finalWeight} onChange={(e) => setFinalWeight(e.target.value)} placeholder="e.g. 50" />
                </div>

                <Button onClick={calculate} className="w-full">Calculate Required Score</Button>

                {result && (
                    <div className="mt-4 p-4 bg-slate-50 border rounded-lg text-center">
                        <p className="text-muted-foreground mb-1">You need to score</p>
                        <div className="text-4xl font-bold text-primary">{result}%</div>
                        <p className="text-muted-foreground mt-1">on your final exam.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
