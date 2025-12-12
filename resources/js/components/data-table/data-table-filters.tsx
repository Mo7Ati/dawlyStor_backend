import React, { useState } from 'react'
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";
import { cn } from "@/lib/utils";



const DataTableFilters = ({ filters }: { filters: React.ReactNode }) => {
    const [open, setOpen] = useState(false);
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" >
                    <Filter size={16} />
                    Filters
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align="center"
                sideOffset={6}
            >
                <div className="space-y-4">
                    {/* Reset filters */}
                    <button
                        onClick={() => { }}
                        className="text-red-600 text-sm font-medium hover:underline"
                    >
                        Reset filters
                    </button>
                    {filters}
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default DataTableFilters
