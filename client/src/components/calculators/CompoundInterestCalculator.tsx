import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function CompoundInterestCalculator() {
    const [principal, setPrincipal] = useState(5000);
    const [monthlyContribution, setMonthlyContribution] = useState(200);
    const [years, setYears] = useState(10);
    const [interestRate, setInterestRate] = useState(5);
    const [compoundFreq, setCompoundFreq] = useState("12"); // 12 = monthly, 1 = annually

    const calculate = () => {
        let balance = principal;
        const freq = Number(compoundFreq);
        const data = [];

        for (let i = 1; i <= years; i++) {
            // Simple iteration for visualization
            for (let j = 0; j < freq; j++) {
                balance += (monthlyContribution * 12) / freq;
                balance *= (1 + (interestRate / 100) / freq);
            }
            data.push({
                year: i,
                balance: Math.round(balance),
                invested: Math.round(principal + (monthlyContribution * 12 * i))
            });
        }

        return { balance, data, invested: principal + (monthlyContribution * 12 * years) };
    };

    const { balance, data, invested } = calculate();

    return (
        <div className="grid md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Compound Interest Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Initial Deposit (${principal.toLocaleString()})</Label>
                        <Slider value={[principal]} onValueChange={(v) => setPrincipal(v[0])} min={0} max={100000} step={100} />
                        <Input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} />
                    </div>

                    <div className="space-y-2">
                        <Label>Monthly Contribution (${monthlyContribution.toLocaleString()})</Label>
                        <Slider value={[monthlyContribution]} onValueChange={(v) => setMonthlyContribution(v[0])} min={0} max={5000} step={50} />
                        <Input type="number" value={monthlyContribution} onChange={(e) => setMonthlyContribution(Number(e.target.value))} />
                    </div>

                    <div className="space-y-2">
                        <Label>Investment Years ({years})</Label>
                        <Slider value={[years]} onValueChange={(v) => setYears(v[0])} min={1} max={50} step={1} />
                        <Input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} />
                    </div>

                    <div className="space-y-2">
                        <Label>Interest Rate ({interestRate}%)</Label>
                        <Slider value={[interestRate]} onValueChange={(v) => setInterestRate(v[0])} min={0} max={15} step={0.1} />
                        <Input type="number" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} step={0.1} />
                    </div>

                    <div className="space-y-2">
                        <Label>Compounding Frequency</Label>
                        <Select value={compoundFreq} onValueChange={setCompoundFreq}>
                            <SelectTrigger>
                                <SelectValue placeholder="Frequency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Annually</SelectItem>
                                <SelectItem value="4">Quarterly</SelectItem>
                                <SelectItem value="12">Monthly</SelectItem>
                                <SelectItem value="365">Daily</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-slate-50">
                <CardHeader>
                    <CardTitle>Projection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-center py-4">
                        <span className="text-sm text-muted-foreground">Future Value</span>
                        <div className="text-4xl font-bold text-green-600">
                            ${balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </div>
                        <div className="text-sm text-slate-500 mt-2">
                            Total Invested: ${invested.toLocaleString()} <br />
                            Total Interest: ${(balance - invested).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </div>
                    </div>

                    <div className="h-[250px] w-full text-xs">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" />
                                <YAxis />
                                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                                <Legend />
                                <Bar dataKey="invested" stackId="a" fill="#94a3b8" name="Principal" />
                                <Bar dataKey="balance" stackId="a" fill="#16a34a" name="Total Interest" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
