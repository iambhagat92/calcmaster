import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PercentageCalculator() {
    const [inputs, setInputs] = useState({
        whatIsXOfY_X: "",
        whatIsXOfY_Y: "",
        whatIsXOfY_Result: null as string | null,

        xIsWhatPercentOfY_X: "",
        xIsWhatPercentOfY_Y: "",
        xIsWhatPercentOfY_Result: null as string | null,

        whatIsPercentChange_From: "",
        whatIsPercentChange_To: "",
        whatIsPercentChange_Result: null as string | null
    });

    const calc1 = () => {
        const x = parseFloat(inputs.whatIsXOfY_X);
        const y = parseFloat(inputs.whatIsXOfY_Y);
        if (!isNaN(x) && !isNaN(y)) {
            setInputs(prev => ({ ...prev, whatIsXOfY_Result: String((x / 100) * y) }));
        }
    };

    const calc2 = () => {
        const x = parseFloat(inputs.xIsWhatPercentOfY_X);
        const y = parseFloat(inputs.xIsWhatPercentOfY_Y);
        if (!isNaN(x) && !isNaN(y) && y !== 0) {
            setInputs(prev => ({ ...prev, xIsWhatPercentOfY_Result: String((x / y) * 100) + "%" }));
        }
    };

    const calc3 = () => {
        const from = parseFloat(inputs.whatIsPercentChange_From);
        const to = parseFloat(inputs.whatIsPercentChange_To);
        if (!isNaN(from) && !isNaN(to) && from !== 0) {
            const change = ((to - from) / from) * 100;
            setInputs(prev => ({ ...prev, whatIsPercentChange_Result: (change > 0 ? "+" : "") + change.toFixed(2) + "%" }));
        }
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader><CardTitle>What is X% of Y?</CardTitle></CardHeader>
                <CardContent className="flex items-end gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                        <span>What is</span>
                        <Input className="w-24" type="number" placeholder="X" value={inputs.whatIsXOfY_X} onChange={e => setInputs({ ...inputs, whatIsXOfY_X: e.target.value })} />
                        <span>% of</span>
                        <Input className="w-24" type="number" placeholder="Y" value={inputs.whatIsXOfY_Y} onChange={e => setInputs({ ...inputs, whatIsXOfY_Y: e.target.value })} />
                    </div>
                    <Button onClick={calc1}>Calculate</Button>
                    {inputs.whatIsXOfY_Result && <span className="text-2xl font-bold text-primary ml-auto">{inputs.whatIsXOfY_Result}</span>}
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>X is what % of Y?</CardTitle></CardHeader>
                <CardContent className="flex items-end gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                        <Input className="w-24" type="number" placeholder="X" value={inputs.xIsWhatPercentOfY_X} onChange={e => setInputs({ ...inputs, xIsWhatPercentOfY_X: e.target.value })} />
                        <span>is what % of</span>
                        <Input className="w-24" type="number" placeholder="Y" value={inputs.xIsWhatPercentOfY_Y} onChange={e => setInputs({ ...inputs, xIsWhatPercentOfY_Y: e.target.value })} />
                    </div>
                    <Button onClick={calc2}>Calculate</Button>
                    {inputs.xIsWhatPercentOfY_Result && <span className="text-2xl font-bold text-primary ml-auto">{inputs.xIsWhatPercentOfY_Result}</span>}
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Percentage Increase/Decrease</CardTitle></CardHeader>
                <CardContent className="flex items-end gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                        <span>From</span>
                        <Input className="w-24" type="number" placeholder="Start" value={inputs.whatIsPercentChange_From} onChange={e => setInputs({ ...inputs, whatIsPercentChange_From: e.target.value })} />
                        <span>to</span>
                        <Input className="w-24" type="number" placeholder="End" value={inputs.whatIsPercentChange_To} onChange={e => setInputs({ ...inputs, whatIsPercentChange_To: e.target.value })} />
                    </div>
                    <Button onClick={calc3}>Calculate</Button>
                    {inputs.whatIsPercentChange_Result && <span className="text-2xl font-bold text-primary ml-auto">{inputs.whatIsPercentChange_Result}</span>}
                </CardContent>
            </Card>
        </div>
    );
}
