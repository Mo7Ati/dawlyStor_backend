import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import React, { useEffect } from 'react'
import { toast } from 'sonner';

const useFlashMessagesHook = () => {
    const { flash } = usePage<SharedData>().props;

    useEffect(() => {
        if (flash?.success) {
            console.log(flash.success);
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);
}

export default useFlashMessagesHook;
