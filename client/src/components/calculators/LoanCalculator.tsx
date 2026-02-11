import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

export function LoanCalculator() {
    const [amount, setAmount] = useState(10000);
    const [interest, setInterest] = useState(5.5);
    const [years, setYears] = useState(3);

    const calculateLoan = () => {
        const principal = amount;
        const rate = interest / 100 / 12;
        const months = years * 12;

        if (rate === 0) return principal / months;

        const payment = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
        return payment;
    };

    const monthlyPayment = calculateLoan();
    const totalPayment = monthlyPayment * years * 12;
    const totalInterest = totalPayment - amount;

    return (
        <div className="grid md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Loan Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Loan Amount (${amount.toLocaleString()})</Label>
                        <Slider
                            value={[amount]}
                            onValueChange={(v) => setAmount(v[0])}
                            min={1000}
                            max={100000}
                            step={500}
                            className="py-4"
                        />
                        <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Interest Rate ({interest}%)</Label>
                        <Slider
                            value={[interest]}
                            onValueChange={(v) => setInterest(v[0])}
                            min={0.1}
                            max={20}
                            step={0.1}
                            className="py-4"
                        />
                        <Input
                            type="number"
                            value={interest}
                            onChange={(e) => setInterest(Number(e.target.value))}
                            step={0.1}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Loan Term ({years} years)</Label>
                        <Slider
                            value={[years]}
                            onValueChange={(v) => setYears(v[0])}
                            min={1}
                            max={10}
                            step={1}
                            className="py-4"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>1 Year</span>
                            <span>10 Years</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle>Repayment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-center p-6 bg-white rounded-xl shadow-sm border">
                        <p className="text-muted-foreground mb-1">Monthly Payment</p>
                        <p className="text-4xl font-bold text-primary">
                            ${monthlyPayment.toFixed(2)}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Principal</span>
                            <span className="font-semibold">${amount.toLocaleString()}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Interest</span>
                            <span className="font-semibold text-red-600">
                                ${totalInterest.toFixed(2)}
                            </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between pt-2">
                            <span className="font-bold">Total Cost</span>
                            <span className="font-bold">${totalPayment.toFixed(2)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
