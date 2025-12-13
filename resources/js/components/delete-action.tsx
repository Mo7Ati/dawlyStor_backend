import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogFooter,
    AlertDialogDescription,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    AlertDialogCancel,
} from '@/components/ui/alert-dialog';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { DeleteIcon, TrashIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const DeleteAction = ({ onDelete }: { onDelete: () => void }) => {
    const { t } = useTranslation('general')
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <TrashIcon className="h-4 w-4" /> {t('Delete')}
                </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this
                        admin and remove their data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete}>
                        {t('Delete')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteAction
