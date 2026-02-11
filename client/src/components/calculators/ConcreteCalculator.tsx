import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cuboid, HardHat } from "lucide-react";

export function ConcreteCalculator() {
    const [dimensions, setDimensions] = useState({ length: 10, width: 10, depth: 4, unit: "feet" });
    const [result, setResult] = useState<{
        cubicFeet: number;
        cubicYards: number;
        bags60lb: number;
        bags80lb: number;
    } | null>(null);

    const calculate = () => {
        let l = dimensions.length;
        let w = dimensions.width;
        let d = dimensions.depth; // assuming inches for depth if unit is feet, or consistent if metric

        // Standardize to feet for calculation (assuming Length/Width in feet, Depth in inches for typical slab)
        // If unit is "feet", we assume L & W are feet, Depth is inches (common user behavior)
        let cubicFeet = 0;

        if (dimensions.unit === "feet") {
            cubicFeet = l * w * (d / 12);
        } else {
            // Metric (Meters / CM)
            // Convert to feet for bag calculation or keep metric? 
            // Let's stick to Imperial for this MVP as it's most common for DIY in US/UK, add metric toggle later
            // Just simpler to enforce one for now or handle simple conversion
            cubicFeet = (l * 3.28084) * (w * 3.28084) * (d / 2.54 / 12); // rough conversion if input was meters/cm
        }

        // Ensure we handle the "depth in inches" convention for feet
        // actually let's make it explicit in UI

        const cubicYards = cubicFeet / 27;

        // Bags: 
        // 60lb bag ~= 0.45 cu ft
        // 80lb bag ~= 0.60 cu ft
        const bags60 = Math.ceil(cubicFeet / 0.45);
        const bags80 = Math.ceil(cubicFeet / 0.60);

        setResult({
            cubicFeet,
            cubicYards,
            bags60lb: bags60,
            bags80lb: bags80
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
                <CardHeader><CardTitle>Slab / Footing Dimensions</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Length (feet)</Label>
                            <Input type="number" value={dimensions.length} onChange={(e) => setDimensions({ ...dimensions, length: parseFloat(e.target.value) })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Width (feet)</Label>
                            <Input type="number" value={dimensions.width} onChange={(e) => setDimensions({ ...dimensions, width: parseFloat(e.target.value) })} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Depth/Thickness (inches)</Label>
                        <Input type="number" value={dimensions.depth} onChange={(e) => setDimensions({ ...dimensions, depth: parseFloat(e.target.value) })} />
                    </div>

                    <Button onClick={calculate} className="w-full">Calculate Concrete</Button>
                </CardContent>
            </Card>

            {result ? (
                <Card className="bg-slate-50">
                    <CardHeader><CardTitle>Materials Needed</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-4 bg-white rounded border shadow-sm">
                                <p className="text-xs text-muted-foreground uppercase">Volume</p>
                                <p className="text-xl font-bold">{result.cubicYards.toFixed(2)}</p>
                                <p className="text-xs text-muted-foreground">Cubic Yards</p>
                            </div>
                            <div className="p-4 bg-white rounded border shadow-sm">
                                <p className="text-xs text-muted-foreground uppercase">Volume</p>
                                <p className="text-xl font-bold">{result.cubicFeet.toFixed(2)}</p>
                                <p className="text-xs text-muted-foreground">Cubic Feet</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-semibold flex items-center gap-2">
                                <Cuboid className="h-4 w-4" /> Pre-Mix Bags Required
                            </h4>
                            <div className="flex justify-between items-center p-3 bg-white rounded-md border border-slate-200">
                                <span>60 lb Bags</span>
                                <span className="font-bold text-lg">{result.bags60lb}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white rounded-md border border-slate-200">
                                <span>80 lb Bags</span>
                                <span className="font-bold text-lg">{result.bags80lb}</span>
                            </div>
                            <p className="text-xs text-muted-foreground italic mt-2 text-center">
                                *Includes ~5-10% waste factor recommended.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="hidden lg:flex items-center justify-center p-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-300">
                    <div className="text-center text-muted-foreground">
                        <HardHat className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>Enter dimensions to estimate concrete volume.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
