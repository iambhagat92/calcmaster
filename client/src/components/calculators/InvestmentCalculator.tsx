import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export function InvestmentCalculator() {
    const [initial, setInitial] = useState(5000);
    const [monthly, setMonthly] = useState(200);
    const [rate, setRate] = useState(7);
    const [years, setYears] = useState(20);

    const calculateGrowth = () => {
        let balance = initial;
        let totalContribution = initial;

        for (let i = 0; i < years * 12; i++) {
            balance += monthly;
            totalContribution += monthly;
            balance *= (1 + rate / 100 / 12);
        }

        return {
            balance,
            totalContribution,
            interest: balance - totalContribution
        };
    };

    const result = calculateGrowth();

    const data = [
        { name: 'Principal', value: result.totalContribution },
        { name: 'Interest', value: result.interest }
    ];

    const COLORS = ['#94a3b8', '#16a34a'];

    return (
        <div className="grid md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Investment Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Initial Deposit */}
                    <div className="space-y-2">
                        <Label>Starting Amount (${initial.toLocaleString()})</Label>
                        <Slider
                            value={[initial]}
                            onValueChange={(v) => setInitial(v[0])}
                            min={0}
                            max={100000}
                            step={500}
                        />
                        <Input
                            type="number"
                            value={initial}
                            onChange={(e) => setInitial(Number(e.target.value))}
                        />
                    </div>

                    {/* Monthly Contribution */}
                    <div className="space-y-2">
                        <Label>Monthly Contribution (${monthly.toLocaleString()})</Label>
                        <Slider
                            value={[monthly]}
                            onValueChange={(v) => setMonthly(v[0])}
                            min={0}
                            max={5000}
                            step={50}
                        />
                        <Input
                            type="number"
                            value={monthly}
                            onChange={(e) => setMonthly(Number(e.target.value))}
                        />
                    </div>

                    {/* Interest Rate */}
                    <div className="space-y-2">
                        <Label>Annual Return ({rate}%)</Label>
                        <Slider
                            value={[rate]}
                            onValueChange={(v) => setRate(v[0])}
                            min={1}
                            max={15}
                            step={0.5}
                        />
                        <Input
                            type="number"
                            value={rate}
                            onChange={(e) => setRate(Number(e.target.value))}
                            step={0.1}
                        />
                    </div>

                    {/* Years */}
                    <div className="space-y-2">
                        <Label>Investment Period ({years} years)</Label>
                        <Slider
                            value={[years]}
                            onValueChange={(v) => setYears(v[0])}
                            min={1}
                            max={40}
                            step={1}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-slate-50">
                <CardHeader>
                    <CardTitle>Future Value</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-center py-4">
                        <span className="text-sm text-muted-foreground">Total Balance</span>
                        <div className="text-4xl font-bold text-green-600">
                            ${result.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </div>
                    </div>

                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="space-y-4 pt-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-slate-400" />
                                <span className="text-sm">Total Contribution</span>
                            </div>
                            <span className="font-bold">${result.totalContribution.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-600" />
                                <span className="text-sm">Total Interest Earned</span>
                            </div>
                            <span className="font-bold text-green-600">+${result.interest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
