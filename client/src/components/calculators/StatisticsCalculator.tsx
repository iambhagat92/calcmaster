import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function StatisticsCalculator() {
    const [input, setInput] = useState("10, 20, 30, 40, 50");
    const [result, setResult] = useState<{
        count: number;
        sum: number;
        mean: number;
        median: number;
        mode: number[];
        range: number;
        variance: number;
        stdDev: number;
        min: number;
        max: number;
    } | null>(null);

    const calculate = () => {
        // Parse input
        const numbers = input
            .split(/[\n,;]+/) // Split by comma, newline, or semicolon
            .map(s => s.trim())
            .filter(s => s !== "")
            .map(Number)
            .filter(n => !isNaN(n))
            .sort((a, b) => a - b);

        if (numbers.length === 0) return;

        const count = numbers.length;
        const sum = numbers.reduce((a, b) => a + b, 0);
        const mean = sum / count;

        // Median
        const mid = Math.floor(count / 2);
        const median = count % 2 !== 0 ? numbers[mid] : (numbers[mid - 1] + numbers[mid]) / 2;

        // Mode
        const counts: Record<string, number> = {};
        numbers.forEach(n => counts[n] = (counts[n] || 0) + 1);
        let maxFreq = 0;
        for (const n in counts) maxFreq = Math.max(maxFreq, counts[n]);
        const mode = Object.keys(counts).filter(n => counts[n] === maxFreq).map(Number).sort((a, b) => a - b);

        // Range
        const min = numbers[0];
        const max = numbers[count - 1];
        const range = max - min;

        // Variance & StdDev (Sample)
        const variance = count > 1 ? numbers.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (count - 1) : 0;
        const stdDev = Math.sqrt(variance);

        setResult({
            count,
            sum,
            mean,
            median,
            mode,
            range,
            variance,
            stdDev,
            min,
            max
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Data Input</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Enter numbers (separated by comma, space, or new line)</Label>
                        <Textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Example: 12, 15, 22, 5, 8"
                            className="h-[200px] font-mono"
                        />
                    </div>
                    <Button onClick={calculate} className="w-full">Calculate Statistics</Button>
                </CardContent>
            </Card>

            {result ? (
                <Card className="bg-slate-50">
                    <CardHeader>
                        <CardTitle>Results</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-3 bg-white rounded border shadow-sm">
                                <p className="text-xs text-muted-foreground uppercase">Count</p>
                                <p className="text-xl font-bold">{result.count}</p>
                            </div>
                            <div className="p-3 bg-white rounded border shadow-sm">
                                <p className="text-xs text-muted-foreground uppercase">Sum</p>
                                <p className="text-xl font-bold">{result.sum.toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-white rounded border shadow-sm col-span-2">
                                <p className="text-xs text-muted-foreground uppercase">Mean (Average)</p>
                                <p className="text-3xl font-bold text-primary">{result.mean.toFixed(4)}</p>
                            </div>
                            <div className="p-3 bg-white rounded border shadow-sm">
                                <p className="text-xs text-muted-foreground uppercase">Median</p>
                                <p className="text-xl font-bold">{result.median}</p>
                            </div>
                            <div className="p-3 bg-white rounded border shadow-sm">
                                <p className="text-xs text-muted-foreground uppercase">Mode</p>
                                <p className="text-xl font-bold">{result.mode.length > 5 ? result.mode.slice(0, 5).join(", ") + "..." : result.mode.join(", ")}</p>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Standard Deviation (Sample)</span>
                                <span className="font-mono">{result.stdDev.toFixed(4)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Variance (Sample)</span>
                                <span className="font-mono">{result.variance.toFixed(4)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Min Value</span>
                                <span className="font-mono">{result.min}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Max Value</span>
                                <span className="font-mono">{result.max}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Range</span>
                                <span className="font-mono">{result.range}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="hidden lg:flex items-center justify-center p-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-300">
                    <div className="text-center text-muted-foreground">
                        <p>Enter your dataset to calculate properties.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
