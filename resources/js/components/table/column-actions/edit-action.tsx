import { router } from '@inertiajs/react';
import { PencilIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePermissions } from '@/hooks/use-permissions';
import { cn } from '@/lib/utils';

type EditActionProps = {
    editRoute: string;
    permission?: string;
    className?: string;
}

export function EditAction({ editRoute, permission, className }: EditActionProps) {
    const { hasPermission } = usePermissions();

    if (permission && !hasPermission(permission)) {
        return null;
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            className={cn("cursor-pointer", className)}
            onClick={() => {
                router.visit(editRoute, { preserveState: true, preserveScroll: true });
            }}
        >
            <PencilIcon className="h-4 w-4" />
        </Button>
    );
}
