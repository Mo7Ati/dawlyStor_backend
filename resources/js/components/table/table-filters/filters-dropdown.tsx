import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';


interface FilterDropdownProps {
    children: React.ReactNode;
    activeFiltersCount: number;
    onClearFilters?: () => void;
}

export default function FilterDropdown(props: FilterDropdownProps) {
    const [open, setOpen] = useState(false);
    const { t } = useTranslation('common');
    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="relative">
                    <Filter size={16} />
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
                <Label className="text-sm font-medium mb-4 block text-left">{t('filters')}</Label>
                <div className="flex flex-col gap-4">
                    {props.children}
                </div>
                <div className="flex justify-center mt-4">
                    {props.activeFiltersCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={() => {
                            props.onClearFilters?.();
                            setOpen(false);
                        }} className="h-9 px-2 lg:px-3">
                            <X className="h-4 w-4 mr-1" />
                            {t('clear_filters')}
                        </Button>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
