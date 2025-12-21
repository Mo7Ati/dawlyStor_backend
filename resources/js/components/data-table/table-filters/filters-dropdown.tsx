import React, { useState, useMemo } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Badge } from '../../ui/badge';


interface FilterDropdownProps {
    children: React.ReactNode;
    activeFiltersCount: number;
}

export default function FilterDropdown(props: FilterDropdownProps) {
    const [open, setOpen] = useState(false);

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="relative">
                    <Filter size={16} />
                    Filters
                    {props.activeFiltersCount > 0 && (
                        <Badge
                            variant="default"
                            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 rounded-full text-xs font-semibold"
                        >
                            {props.activeFiltersCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 p-4" align="center">
                <Label className="text-sm font-medium mb-4 block text-left">Filters</Label>
                <div className="flex flex-col gap-4">
                    {props.children}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
