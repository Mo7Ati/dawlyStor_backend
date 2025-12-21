import React, { useState } from 'react'
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const IsActiveFormField = ({ value }: { value: boolean }) => {
    const [isActive, setIsActive] = useState(value);
    return (
        <div className="flex items-center space-x-2">
            <Label htmlFor="is_active" className="text-sm font-normal">
                Active
            </Label>
            <Switch id="is_active" name="is_active" defaultChecked={isActive} onCheckedChange={(checked) => setIsActive(checked)} className=' cursor-pointer' />
            <input type="hidden" name="is_active" value={isActive ? '1' : '0'} />
        </div>
    )
}

export default IsActiveFormField;
