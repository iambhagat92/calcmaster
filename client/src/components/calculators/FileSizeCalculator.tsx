import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function FileSizeCalculator() {
    const [value, setValue] = useState("");
    const [fromUnit, setFromUnit] = useState("MB");
    const [toUnit, setToUnit] = useState("GB");
    const [result, setResult] = useState<string | null>(null);

    const units = ["Bytes", "KB", "MB", "GB", "TB", "PB"];

    const calculate = () => {
        const val = parseFloat(value);
        if (isNaN(val)) return;

        // Convert to bytes first
        let bytes = val;
        const fromIndex = units.indexOf(fromUnit);
        bytes = val * Math.pow(1024, fromIndex);

        // Convert to target
        const toIndex = units.indexOf(toUnit);
        const res = bytes / Math.pow(1024, toIndex);

        setResult(res.toLocaleString(undefined, { maximumFractionDigits: 6 }));
    };

    return (
        <Card className="max-w-md mx-auto">
            <CardHeader><CardTitle>Data Unit Converter</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-end">
                    <div className="space-y-2">
                        <Label>From</Label>
                        <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} />
                        <Select value={fromUnit} onValueChange={setFromUnit}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {units.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="pb-3 text-2xl text-muted-foreground">=</div>

                    <div className="space-y-2">
                        <Label>To</Label>
                        <div className="flex h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm items-center overflow-x-auto">
                            {result || "-"}
                        </div>
                        <Select value={toUnit} onValueChange={setToUnit}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {units.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Button onClick={calculate} className="w-full">Convert</Button>
            </CardContent>
        </Card>
    );
}
