import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function BandwidthCalculator() {
    const [fileSize, setFileSize] = useState("");
    const [sizeUnit, setSizeUnit] = useState("GB");
    const [speed, setSpeed] = useState("");
    const [speedUnit, setSpeedUnit] = useState("Mbps");
    const [result, setResult] = useState<string | null>(null);

    const calculate = () => {
        const size = parseFloat(fileSize);
        const rate = parseFloat(speed);

        if (!size || !rate) return;

        // Convert everything to bits
        let bits = size;
        if (sizeUnit === "KB") bits *= 8 * 1024;
        if (sizeUnit === "MB") bits *= 8 * 1024 * 1024;
        if (sizeUnit === "GB") bits *= 8 * 1024 * 1024 * 1024;
        if (sizeUnit === "TB") bits *= 8 * 1024 * 1024 * 1024 * 1024;

        // Convert rate to bits per second
        let bps = rate;
        if (speedUnit === "Kbps") bps *= 1000;
        if (speedUnit === "Mbps") bps *= 1000 * 1000;
        if (speedUnit === "Gbps") bps *= 1000 * 1000 * 1000;

        const seconds = bits / bps;

        // Format time
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);

        const parts = [];
        if (h > 0) parts.push(`${h} hr`);
        if (m > 0) parts.push(`${m} min`);
        parts.push(`${s} sec`);

        setResult(parts.join(" "));
    };

    return (
        <Card className="max-w-md mx-auto">
            <CardHeader><CardTitle>Download Time Calculator</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                <div className="flex gap-4">
                    <div className="flex-1 space-y-2">
                        <Label>File Size</Label>
                        <div className="flex">
                            <Input type="number" value={fileSize} onChange={(e) => setFileSize(e.target.value)} className="rounded-r-none" />
                            <Select value={sizeUnit} onValueChange={setSizeUnit}>
                                <SelectTrigger className="w-[80px] rounded-l-none"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="KB">KB</SelectItem>
                                    <SelectItem value="MB">MB</SelectItem>
                                    <SelectItem value="GB">GB</SelectItem>
                                    <SelectItem value="TB">TB</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex-1 space-y-2">
                        <Label>Internet Speed</Label>
                        <div className="flex">
                            <Input type="number" value={speed} onChange={(e) => setSpeed(e.target.value)} className="rounded-r-none" />
                            <Select value={speedUnit} onValueChange={setSpeedUnit}>
                                <SelectTrigger className="w-[90px] rounded-l-none"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Kbps">Kbps</SelectItem>
                                    <SelectItem value="Mbps">Mbps</SelectItem>
                                    <SelectItem value="Gbps">Gbps</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <Button onClick={calculate} className="w-full">Calculate Time</Button>

                {result && (
                    <div className="p-6 bg-slate-900 text-white rounded-xl text-center">
                        <p className="text-sm text-slate-400 uppercase tracking-widest mb-2">Estimated Time</p>
                        <div className="text-3xl font-bold font-mono">{result}</div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
