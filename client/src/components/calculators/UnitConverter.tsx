import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRightLeft } from "lucide-react";

const CONVERSION_RATES: Record<string, number> = {
    // Length (Base: Meter)
    m: 1,
    km: 0.001,
    cm: 100,
    mm: 1000,
    ft: 3.28084,
    in: 39.3701,
    yd: 1.09361,
    mi: 0.000621371,

    // Weight (Base: Kilogram)
    kg: 1,
    g: 1000,
    mg: 1000000,
    lb: 2.20462,
    oz: 35.274,
    st: 0.157473,

    // Volume (Base: Liter)
    l: 1,
    ml: 1000,
    gal: 0.264172,
    qt: 1.05669,
    pt: 2.11338,
    cup: 4.22675,
    floz: 33.814,
};

// Temperature needs special logic (offset + scale), handled separately

export function UnitConverter() {
    const [category, setCategory] = useState("length");
    const [amount, setAmount] = useState<string>("1");
    const [fromUnit, setFromUnit] = useState("m");
    const [toUnit, setToUnit] = useState("ft");
    const [result, setResult] = useState<string>("");

    const categories = {
        length: { units: ["m", "km", "cm", "mm", "ft", "in", "yd", "mi"], label: "Length" },
        weight: { units: ["kg", "g", "mg", "lb", "oz", "st"], label: "Weight" },
        volume: { units: ["l", "ml", "gal", "qt", "pt", "cup", "floz"], label: "Volume" },
        temperature: { units: ["c", "f", "k"], label: "Temperature" }
    };

    useEffect(() => {
        // Reset units when category changes
        const cats = categories as any;
        setFromUnit(cats[category].units[0]);
        setToUnit(cats[category].units[1]);
    }, [category]);

    useEffect(() => {
        calculate();
    }, [amount, fromUnit, toUnit, category]);

    const calculate = () => {
        const val = parseFloat(amount);
        if (isNaN(val)) {
            setResult("");
            return;
        }

        if (category === "temperature") {
            let cel = 0;
            // To Celsius
            if (fromUnit === "c") cel = val;
            if (fromUnit === "f") cel = (val - 32) * 5 / 9;
            if (fromUnit === "k") cel = val - 273.15;

            // From Celsius
            let res = 0;
            if (toUnit === "c") res = cel;
            if (toUnit === "f") res = (cel * 9 / 5) + 32;
            if (toUnit === "k") res = cel + 273.15;
            setResult(res.toFixed(2));
        } else {
            // Standard Ratio Conversion
            // Convert From -> Base
            const base = val / CONVERSION_RATES[fromUnit];
            // Convert Base -> To
            const res = base * CONVERSION_RATES[toUnit];
            setResult(res.toLocaleString(undefined, { maximumFractionDigits: 6 }));
        }
    };

    return (
        <Card className="max-w-xl mx-auto">
            <CardHeader>
                <CardTitle className="text-center">Unit Converter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <Tabs value={category} onValueChange={setCategory} className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="length">Length</TabsTrigger>
                        <TabsTrigger value="weight">Weight</TabsTrigger>
                        <TabsTrigger value="volume">Volume</TabsTrigger>
                        <TabsTrigger value="temperature">Temp</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
                    <div className="space-y-2">
                        <Label>From</Label>
                        <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="text-lg" />
                        <Select value={fromUnit} onValueChange={setFromUnit}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {(categories as any)[category].units.map((u: string) => (
                                    <SelectItem key={u} value={u}>{u.toUpperCase()}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="pt-8 text-muted-foreground">
                        <ArrowRightLeft className="h-6 w-6" />
                    </div>

                    <div className="space-y-2">
                        <Label>To</Label>
                        <div className="flex h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-lg text-slate-900 font-medium items-center">
                            {result || "..."}
                        </div>
                        <Select value={toUnit} onValueChange={setToUnit}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {(categories as any)[category].units.map((u: string) => (
                                    <SelectItem key={u} value={u}>{u.toUpperCase()}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
