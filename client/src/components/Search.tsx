import { useState, useEffect } from "react";
import { Calculator, Calendar, CreditCard, Ruler, FileDigit, Search as SearchIcon } from "lucide-react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useCalculators } from "@/hooks/use-calculators";

export function Search() {
    const [open, setOpen] = useState(false);
    const [, setLocation] = useLocation();
    const { data: calculators } = useCalculators();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    const getIcon = (slug: string) => {
        if (slug.includes("mortgage") || slug.includes("loan") || slug.includes("finance")) return <CreditCard className="mr-2 h-4 w-4" />;
        if (slug.includes("date") || slug.includes("age") || slug.includes("time")) return <Calendar className="mr-2 h-4 w-4" />;
        if (slug.includes("concrete") || slug.includes("paint") || slug.includes("construction")) return <Ruler className="mr-2 h-4 w-4" />;
        if (slug.includes("bandwidth") || slug.includes("file") || slug.includes("tech")) return <FileDigit className="mr-2 h-4 w-4" />;
        return <Calculator className="mr-2 h-4 w-4" />;
    };

    return (
        <>
            <Button
                variant="outline"
                className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
                onClick={() => setOpen(true)}
            >
                <SearchIcon className="h-4 w-4 xl:mr-2" />
                <span className="hidden xl:inline-flex">Search calculators...</span>
                <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                        <CommandItem onSelect={() => runCommand(() => setLocation("/"))}>
                            <Calculator className="mr-2 h-4 w-4" />
                            <span>Home</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => setLocation("/blog"))}>
                            <FileDigit className="mr-2 h-4 w-4" />
                            <span>Blog</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Calculators">
                        {calculators?.map((calc) => (
                            <CommandItem key={calc.id} onSelect={() => runCommand(() => setLocation(`/${calc.category?.slug}/${calc.slug}`))}>
                                {getIcon(calc.slug)}
                                <span>{calc.name}</span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}
