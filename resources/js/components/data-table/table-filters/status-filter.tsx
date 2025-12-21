import { useState } from "react";
import { router } from "@inertiajs/react";
import { useTranslation } from 'react-i18next';
import { Label } from "@/components/ui/label";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";



interface StatusFilterProps {
    value: string | undefined;
    onChange: (key: string, value: string | undefined) => void;
}

const StatusFilter = (props: StatusFilterProps) => {
    const { t: tTables } = useTranslation('tables');
    const { t: tForms } = useTranslation('forms');

    return (
        <div id="status-filter" className="flex flex-col gap-2">
            <Label>{tTables('common.status')}</Label>
            <Select value={props.value ?? 'all'} onValueChange={(value) => props.onChange("is_active", value)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={tForms('common.all')} />
                </SelectTrigger>
                <SelectContent>
                    {/* @ts-ignore */}
                    <SelectItem value="all">
                        {tForms('common.all')}
                    </SelectItem>
                    <SelectItem value="1">
                        {tTables('common.active')}
                    </SelectItem>
                    <SelectItem value="0">
                        {tTables('common.inactive')}
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}

export default StatusFilter
