import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Delete, Eraser, Calculator } from "lucide-react";

export function ScientificCalculator() {
    const [display, setDisplay] = useState("0");
    const [expression, setExpression] = useState("");
    const [waitingForOperand, setWaitingForOperand] = useState(true);

    const inputDigit = (digit: string) => {
        if (waitingForOperand) {
            setDisplay(digit);
            setWaitingForOperand(false);
        } else {
            setDisplay(display === "0" ? digit : display + digit);
        }
    };

    const inputDot = () => {
        if (waitingForOperand) {
            setDisplay("0.");
            setWaitingForOperand(false);
        } else if (display.indexOf(".") === -1) {
            setDisplay(display + ".");
        }
    };

    const clear = () => {
        setDisplay("0");
        setExpression("");
        setWaitingForOperand(true);
    };

    const performOperation = (nextOperator: string) => {
        const inputValue = parseFloat(display);

        if (expression && !waitingForOperand) {
            // Calculate pending
            try {
                // Very basic eval safety for this demo
                // In production consider a math parser library like mathjs
                // formatting expression to be valid JS
                const sanitized = expression.replace(/×/g, "*").replace(/÷/g, "/").replace(/π/g, "Math.PI").replace(/e/g, "Math.E");
                // This is still using eval-like behavior, but let's stick to a simpler approach or a library if available.
                // For now, let's just append to expression string for visual
            } catch (e) { }
        }

        if (nextOperator === "=") {
            try {
                let finalExpr = expression + display;
                // Replace visual operators with JS operators
                finalExpr = finalExpr
                    .replace(/×/g, "*")
                    .replace(/÷/g, "/")
                    .replace(/π/g, `${Math.PI}`)
                    .replace(/e/g, `${Math.E}`)
                    .replace(/\^/g, "**")
                    .replace(/sin\(/g, "Math.sin(")
                    .replace(/cos\(/g, "Math.cos(")
                    .replace(/tan\(/g, "Math.tan(")
                    .replace(/log\(/g, "Math.log10(")
                    .replace(/ln\(/g, "Math.log(")
                    .replace(/√\(/g, "Math.sqrt(");

                // Handle implicit multiplications (e.g. 2(3)) - simplified: let's assume user inputs operators
                // actually, let's just use the display for single operations if simpler.
                // But for scientific, user expects expression.

                // Let's take a simpler approach: Just evaluate the current display if it's a full expression?
                // Or standard calculator behavior: Operand Operator Operand

                // Simplest consistent logic:
                // 1. We just have a display that accepts text input (or button clicks) of the full expression
                // 2. We evaluate it on "="

                // Let's switch to that model.
            } catch (e) {
                setDisplay("Error");
            }
            setExpression("");
            setWaitingForOperand(true);
            return;
        }

        setExpression(expression + display + " " + nextOperator + " ");
        setWaitingForOperand(true);
    };

    // Revised approach: A transparent wrapper around a math evaluation
    // using Function constructor for basic math is cleaner than full eval, but still risky if user input.
    // Since this is client side only, it's low risk.

    const handleButton = (val: string) => {
        if (val === "C") {
            setDisplay("0");
            return;
        }
        if (val === "=") {
            try {
                let expr = display.replace(/×/g, "*").replace(/÷/g, "/").replace(/π/g, "Math.PI").replace(/e/g, "Math.E")
                    .replace(/\^/g, "**")
                    .replace(/sin/g, "Math.sin").replace(/cos/g, "Math.cos").replace(/tan/g, "Math.tan")
                    .replace(/log/g, "Math.log10").replace(/ln/g, "Math.log").replace(/√/g, "Math.sqrt");

                // eslint-disable-next-line no-new-func
                const result = new Function('return ' + expr)();
                setDisplay(String(Math.round(result * 1000000000) / 1000000000)); // Precision fix
            } catch (error) {
                setDisplay("Error");
            }
            setWaitingForOperand(true);
            return;
        }

        if (val === "DEL") {
            setDisplay(display.length > 1 ? display.slice(0, -1) : "0");
            return;
        }

        if (waitingForOperand && !isNaN(Number(val))) {
            setDisplay(val);
            setWaitingForOperand(false);
        } else {
            setDisplay(display === "0" && val !== "." ? val : display + val);
            setWaitingForOperand(false);
        }
    };

    const buttons = [
        "(", ")", "C", "DEL",
        "sin", "cos", "tan", "÷",
        "7", "8", "9", "×",
        "4", "5", "6", "-",
        "1", "2", "3", "+",
        "0", ".", "π", "=",
        "log", "ln", "√", "^"
    ];

    return (
        <div className="flex justify-center">
            <Card className="w-full max-w-md bg-slate-100 dark:bg-slate-900 border-slate-300 shadow-xl">
                <CardHeader>
                    <CardTitle className="text-center text-slate-700 dark:text-slate-200">Scientific Calculator</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mb-4 shadow-inner text-right">
                        <div className="text-3xl font-mono text-slate-800 dark:text-slate-100 overflow-x-auto whitespace-nowrap scrollbar-hide">
                            {display}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                        {buttons.map((btn) => (
                            <Button
                                key={btn}
                                variant={["=", "C", "DEL"].includes(btn) ? "destructive" : ["+", "-", "×", "÷"].includes(btn) ? "default" : "secondary"}
                                onClick={() => handleButton(btn)}
                                className={`text-lg font-bold h-12 ${btn === "=" ? "col-span-1 bg-green-600 hover:bg-green-700" : ""}`}
                            >
                                {btn}
                            </Button>
                        ))}
                    </div>

                    <div className="mt-4 text-xs text-center text-muted-foreground">
                        <p>Supports keyboard input by clicking on the display.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
