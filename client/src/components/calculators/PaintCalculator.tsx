import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaintBucket, DoorOpen } from "lucide-react";

export function PaintCalculator() {
    const [room, setRoom] = useState({ length: 12, width: 10, height: 8 });
    const [details, setDetails] = useState({ windows: 1, doors: 1, coats: 2 });
    const [result, setResult] = useState<{
        wallArea: number;
        gallons: number;
        quarts: number;
    } | null>(null);

    const calculate = () => {
        // Wall Area = 2*(L*H) + 2*(W*H)
        const grossWallArea = 2 * (room.length * room.height) + 2 * (room.width * room.height);

        // Deductions
        // Door avg: 20 sq ft
        // Window avg: 15 sq ft
        const deductions = (details.doors * 20) + (details.windows * 15);

        const netArea = grossWallArea - deductions;
        const totalCoverageNeeded = netArea * details.coats;

        // 1 Gallon covers ~350-400 sq ft. Let's use 350 for safety.
        const gallonsNeeded = totalCoverageNeeded / 350;

        setResult({
            wallArea: netArea,
            gallons: Math.ceil(gallonsNeeded * 10) / 10, // Round to 1 decimal
            quarts: Math.ceil(gallonsNeeded * 4)
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
                <CardHeader><CardTitle>Room Dimensions</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Length (ft)</Label>
                            <Input type="number" value={room.length} onChange={(e) => setRoom({ ...room, length: parseFloat(e.target.value) })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Width (ft)</Label>
                            <Input type="number" value={room.width} onChange={(e) => setRoom({ ...room, width: parseFloat(e.target.value) })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Height (ft)</Label>
                            <Input type="number" value={room.height} onChange={(e) => setRoom({ ...room, height: parseFloat(e.target.value) })} />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Doors</Label>
                            <Input type="number" value={details.doors} onChange={(e) => setDetails({ ...details, doors: parseFloat(e.target.value) })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Windows</Label>
                            <Input type="number" value={details.windows} onChange={(e) => setDetails({ ...details, windows: parseFloat(e.target.value) })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Coats</Label>
                            <Input type="number" value={details.coats} onChange={(e) => setDetails({ ...details, coats: parseFloat(e.target.value) })} />
                        </div>
                    </div>

                    <Button onClick={calculate} className="w-full">Calculate Paint</Button>
                </CardContent>
            </Card>

            {result ? (
                <Card className="bg-slate-50">
                    <CardHeader><CardTitle>Paint Requirements</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-slate-100">
                            <p className="text-muted-foreground uppercase text-xs font-bold tracking-wider mb-2">Gallons Needed</p>
                            <div className="text-5xl font-display font-bold text-blue-600">
                                {Math.ceil(result.gallons)}
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                                approx {result.gallons} gallons coverage for {details.coats} coat{details.coats > 1 ? 's' : ''}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex justify-between p-2 border-b">
                                <span className="text-muted-foreground">Paintable Wall Area</span>
                                <span className="font-medium">{result.wallArea} sq ft</span>
                            </div>
                            <div className="flex justify-between p-2 border-b">
                                <span className="text-muted-foreground">Coverage per Gallon</span>
                                <span className="font-medium">~350 sq ft</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="hidden lg:flex items-center justify-center p-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-300">
                    <div className="text-center text-muted-foreground">
                        <PaintBucket className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>Enter dimensions to estimate paint needed.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
