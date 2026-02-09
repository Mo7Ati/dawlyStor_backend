import { Label } from '@/components/ui/label'
import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTranslation } from 'react-i18next';

interface IsAcceptedFilterProps {
    value: string | undefined;
    onChange: (key: string, value: string | undefined) => void;
}

const IsAcceptedFilter = (props: IsAcceptedFilterProps) => {
    const { t: tTables } = useTranslation('tables');
    const { t: tForms } = useTranslation('forms');

    return (
        <div className="flex flex-col gap-2">
            <Label>{tTables('products.is_accepted')}</Label>
            <Select value={props.value ?? 'all'} onValueChange={(value) => props.onChange("is_accepted", value)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={tForms('common.all')} />
                </SelectTrigger>
                <SelectContent>
                    {/* @ts-ignore */}
                    <SelectItem value="all">
                        {tForms('common.all')}
                    </SelectItem>
                    <SelectItem value="1">
                        {tTables('common.accepted')}
                    </SelectItem>
                    <SelectItem value="0">
                        {tTables('common.not_accepted')}
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}

export default IsAcceptedFilter
