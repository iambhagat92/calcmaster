import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function RetirementCalculator() {
    const [currentAge, setCurrentAge] = useState(30);
    const [retirementAge, setRetirementAge] = useState(65);
    const [currentSavings, setCurrentSavings] = useState(50000);
    const [monthlyContribution, setMonthlyContribution] = useState(1000);
    const [returnRate, setReturnRate] = useState(7);
    const [inflationRate, setInflationRate] = useState(3);

    const calculateRetirement = () => {
        let balance = currentSavings;
        const yearsToRetire = retirementAge - currentAge;
        const data = [];

        for (let i = 0; i <= yearsToRetire; i++) {
            data.push({
                age: currentAge + i,
                balance: Math.round(balance),
            });

            // Add yearly contribution
            balance += monthlyContribution * 12;
            // Apply return
            balance *= (1 + returnRate / 100);
            // Adjust contribution for inflation (optional, keeping simple for now)
        }

        // Calculate purchasing power adjustments
        const realBalance = balance / Math.pow(1 + inflationRate / 100, yearsToRetire);

        return { balance, realBalance, data };
    };

    const { balance, realBalance, data } = calculateRetirement();

    return (
        <div className="grid md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Retirement Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Current Age ({currentAge})</Label>
                            <Input type="number" value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value))} />
                        </div>
                        <div className="space-y-2">
                            <Label>Retirement Age ({retirementAge})</Label>
                            <Input type="number" value={retirementAge} onChange={(e) => setRetirementAge(Number(e.target.value))} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Current Savings (${currentSavings.toLocaleString()})</Label>
                        <Slider value={[currentSavings]} onValueChange={(v) => setCurrentSavings(v[0])} min={0} max={500000} step={1000} />
                        <Input type="number" value={currentSavings} onChange={(e) => setCurrentSavings(Number(e.target.value))} />
                    </div>

                    <div className="space-y-2">
                        <Label>Monthly Contribution (${monthlyContribution.toLocaleString()})</Label>
                        <Slider value={[monthlyContribution]} onValueChange={(v) => setMonthlyContribution(v[0])} min={0} max={10000} step={100} />
                        <Input type="number" value={monthlyContribution} onChange={(e) => setMonthlyContribution(Number(e.target.value))} />
                    </div>

                    <div className="space-y-2">
                        <Label>Annual Return ({returnRate}%)</Label>
                        <Slider value={[returnRate]} onValueChange={(v) => setReturnRate(v[0])} min={1} max={12} step={0.5} />
                    </div>

                    <div className="space-y-2">
                        <Label>Inflation Rate ({inflationRate}%)</Label>
                        <Slider value={[inflationRate]} onValueChange={(v) => setInflationRate(v[0])} min={0} max={8} step={0.5} />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-slate-50">
                <CardHeader>
                    <CardTitle>Retirement Projection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4 text-center">
                        <div>
                            <span className="text-sm text-muted-foreground">Projected Savings at {retirementAge}</span>
                            <div className="text-4xl font-bold text-green-600">
                                ${balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </div>
                        </div>
                        <Separator />
                        <div>
                            <span className="text-sm text-muted-foreground">Purchasing Power (Today's Dollars)</span>
                            <div className="text-2xl font-bold text-slate-700">
                                ${realBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </div>
                        </div>
                    </div>

                    <div className="h-[250px] w-full text-xs mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="age" />
                                <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                                <Tooltip formatter={(value) => `$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
                                <Area type="monotone" dataKey="balance" stroke="#16a34a" fill="#bbf7d0" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
