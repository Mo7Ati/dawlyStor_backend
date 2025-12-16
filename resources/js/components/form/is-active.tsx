import React, { useState } from 'react'
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

const IsActive = ({ value }: { value: boolean }) => {
    const [isActive, setIsActive] = useState(value);
    return (
        <div className="flex items-center space-x-2">
            <Label
                htmlFor="is_active"
                className="text-sm font-normal cursor-pointer"
            >
                Active
            </Label>
            <Checkbox
                id="is_active"
                name="is_active"
                defaultChecked={isActive}
                onCheckedChange={(checked) => setIsActive(checked === true)}
            />
            <input
                type="hidden"
                name="is_active"
                value={isActive ? '1' : '0'}
            />
        </div>
    )
}

export default IsActive;
