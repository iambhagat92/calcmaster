import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { differenceInCalendarDays, addDays, format, isValid } from "date-fns"; // Check available fns

export function DateCalculator() {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [diffResult, setDiffResult] = useState<number | null>(null);

    const [addStartDate, setAddStartDate] = useState("");
    const [daysToAdd, setDaysToAdd] = useState("");
    const [addResult, setAddResult] = useState<string | null>(null);

    const calculateDiff = () => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diff = Math.abs(differenceInCalendarDays(end, start));
            setDiffResult(diff);
        }
    };

    const calculateAdd = () => {
        if (addStartDate && daysToAdd) {
            const start = new Date(addStartDate);
            const days = parseInt(daysToAdd);
            if (!isNaN(days) && isValid(start)) {
                const res = addDays(start, days);
                setAddResult(format(res, "PPP"));
            }
        }
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader><CardTitle>Days Between Dates</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                    <Button onClick={calculateDiff} className="w-full">Calculate Difference</Button>
                    {diffResult !== null && (
                        <div className="text-center text-2xl font-bold text-primary">
                            {diffResult} Days
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Add Days to Date</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-4">
                        <Input type="date" value={addStartDate} onChange={(e) => setAddStartDate(e.target.value)} className="flex-grow" />
                        <Input type="number" placeholder="+ Days" value={daysToAdd} onChange={(e) => setDaysToAdd(e.target.value)} className="w-[100px]" />
                    </div>
                    <Button onClick={calculateAdd} className="w-full">Calculate Date</Button>
                    {addResult && (
                        <div className="text-center text-2xl font-bold text-primary">
                            {addResult}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
