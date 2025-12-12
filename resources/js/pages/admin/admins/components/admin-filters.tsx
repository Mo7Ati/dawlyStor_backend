import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import { useState } from "react";
import { router } from "@inertiajs/react";
import admins from "@/routes/admin/admins";
import { Check, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminsFilters() {
    const url = new URL(window.location.href);
    const [filters, setFilters] = useState<Record<string, string | undefined>>({
        is_active: url.searchParams.get('is_active') || undefined
    });

    console.log(filters);


    const onChange = (key: string, value: string | undefined) => {
        setFilters({ ...filters, [key]: value });

        router.get(admins.index({
            mergeQuery: {
                [key]: value,
                page: 1,
            },
        }).url, {}, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    const resetFilters = () => {
        setFilters({});
        router.get(admins.index.url(), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    return (
        <>
            <Popover>
                <PopoverTrigger asChild>
                    <button className="px-2 py-1 border rounded flex items-center gap-2">
                        <Filter size={14} /> Status
                        {
                            filters.is_active !== undefined && (
                                <Badge variant="secondary">{filters.is_active === "1" ? "Active" : "Inactive"}</Badge>
                            )
                        }
                    </button>
                </PopoverTrigger>

                <PopoverContent className="w-56 p-0">
                    <Command>
                        <CommandInput placeholder={`Filter by Status...`} />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                {
                                    [
                                        { value: undefined, label: "All" },
                                        { value: "1", label: "Active" },
                                        { value: "0", label: "Inactive" },
                                    ].map((opt) => {
                                        const isSelected = filters.is_active === opt.value
                                        return (
                                            <CommandItem
                                                key={opt.value}
                                                onSelect={() => onChange("is_active", opt.value)}
                                            >
                                                <div
                                                    className={`mr-2 flex h-4 w-4 items-center justify-center rounded border ${isSelected ? "bg-primary text-primary-foreground" : "bg-transparent"
                                                        }`}
                                                >
                                                    {isSelected && <Check size={12} />}
                                                </div>
                                                {opt.label}
                                            </CommandItem>
                                        )
                                    })}
                            </CommandGroup>
                        </CommandList>

                        {filters.is_active !== undefined && (
                            <>
                                <CommandSeparator />
                                <div
                                    className="p-2 text-center text-sm cursor-pointer"
                                    onClick={() => onChange("is_active", undefined)}
                                >
                                    Clear Status
                                </div>
                            </>
                        )}
                    </Command>
                </PopoverContent>
            </Popover>

            {/* <button
                onClick={resetFilters}
                className="text-red-600 text-sm font-medium hover:underline"
            >
                Reset filters
            </button> */}
        </>
    );
}
