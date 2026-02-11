import { useState } from "react";
import { format, addDays } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function PregnancyCalculator() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [cycleLength, setCycleLength] = useState("28");
    const [result, setResult] = useState<{
        dueDate: Date;
        conceptionDate: Date;
        trimester1End: Date;
        trimester2End: Date;
    } | null>(null);

    const calculate = () => {
        if (!date) return;

        // Naegele's Rule with cycle adjustment
        // Standard is 280 days from LMP
        // Adjustment: (Cycle Length - 28)
        const adjustment = parseInt(cycleLength) - 28;
        const dueDate = addDays(date, 280 + adjustment);
        const conceptionDate = addDays(date, 14 + adjustment);
        const trimester1End = addDays(date, 12 * 7 + adjustment);
        const trimester2End = addDays(date, 27 * 7 + adjustment);

        setResult({
            dueDate,
            conceptionDate,
            trimester1End,
            trimester2End
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Calculate Due Date</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>First Day of Last Period</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2">
                        <Label>Average Cycle Length (days)</Label>
                        <Select value={cycleLength} onValueChange={setCycleLength}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select cycle length" />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: 16 }, (_, i) => i + 20).map((day) => (
                                    <SelectItem key={day} value={day.toString()}>
                                        {day} days
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button onClick={calculate} className="w-full">
                        Calculate Due Date
                    </Button>
                </CardContent>
            </Card>

            {result ? (
                <Card className="bg-slate-50 border-pink-200">
                    <CardHeader>
                        <CardTitle className="text-pink-600">Your Pregnancy Timeline</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-pink-100">
                            <p className="text-muted-foreground uppercase text-xs font-bold tracking-wider mb-2">Estimated Due Date</p>
                            <div className="text-4xl font-display font-bold text-pink-500">
                                {format(result.dueDate, "MMMM do, yyyy")}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Approx. Conception</span>
                                <span className="font-medium">{format(result.conceptionDate, "MMM do, yyyy")}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">First Trimester Ends</span>
                                <span className="font-medium">{format(result.trimester1End, "MMM do, yyyy")}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Second Trimester Ends</span>
                                <span className="font-medium">{format(result.trimester2End, "MMM do, yyyy")}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="hidden lg:flex items-center justify-center p-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-300">
                    <div className="text-center text-muted-foreground">
                        <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>Select your last period date to see your due date.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
