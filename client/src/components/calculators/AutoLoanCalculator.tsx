import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

export function AutoLoanCalculator() {
    const [price, setPrice] = useState(35000);
    const [downPayment, setDownPayment] = useState(5000);
    const [tradeIn, setTradeIn] = useState(2000);
    const [interest, setInterest] = useState(6.5);
    const [months, setMonths] = useState(60);

    const calculateLoan = () => {
        const loanAmount = price - downPayment - tradeIn;
        if (loanAmount <= 0) return 0;

        const rate = interest / 100 / 12;

        if (rate === 0) return loanAmount / months;

        const payment = (loanAmount * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
        return payment;
    };

    const monthlyPayment = calculateLoan();
    const loanAmount = Math.max(0, price - downPayment - tradeIn);
    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - loanAmount;

    return (
        <div className="grid md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Vehicle Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Vehicle Price (${price.toLocaleString()})</Label>
                        <Slider
                            value={[price]}
                            onValueChange={(v) => setPrice(v[0])}
                            min={5000}
                            max={100000}
                            step={500}
                            className="py-4"
                        />
                        <Input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Down Payment (${downPayment.toLocaleString()})</Label>
                        <Slider
                            value={[downPayment]}
                            onValueChange={(v) => setDownPayment(v[0])}
                            min={0}
                            max={price}
                            step={100}
                            className="py-4"
                        />
                        <Input
                            type="number"
                            value={downPayment}
                            onChange={(e) => setDownPayment(Number(e.target.value))}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Trade-in Value (${tradeIn.toLocaleString()})</Label>
                        <Slider
                            value={[tradeIn]}
                            onValueChange={(v) => setTradeIn(v[0])}
                            min={0}
                            max={price}
                            step={100}
                            className="py-4"
                        />
                        <Input
                            type="number"
                            value={tradeIn}
                            onChange={(e) => setTradeIn(Number(e.target.value))}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Interest Rate ({interest}%)</Label>
                        <Slider
                            value={[interest]}
                            onValueChange={(v) => setInterest(v[0])}
                            min={0}
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
                        <Label>Loan Term ({months} months)</Label>
                        <Slider
                            value={[months]}
                            onValueChange={(v) => setMonths(v[0])}
                            min={12}
                            max={96}
                            step={12}
                            className="py-4"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>12 Mo</span>
                            <span>96 Mo</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle>Payment Summary</CardTitle>
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
                            <span className="text-muted-foreground">Loan Amount</span>
                            <span className="font-semibold">${loanAmount.toLocaleString()}</span>
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
