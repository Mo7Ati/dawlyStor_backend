import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
import { App } from '@/wayfinder/types';
import { useTranslation } from 'react-i18next'
import AdditionForm from './components/addition-form'
import AdditionController from '@/wayfinder/App/Http/Controllers/dashboard/store/AdditionController'

const AdditionsEdit = ({ addition }: { addition: App.Models.Addition }) => {
    const { t } = useTranslation('dashboard')

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('additions.title'),
            href: AdditionController.index.url(),
        },
        {
            title: t('additions.edit'),
            href: AdditionController.edit.url({ addition: Number(addition.id) }),
        },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs} title={t('additions.edit')}>
            <AdditionForm addition={addition} type="edit" />
        </AppLayout>
    )
}

export default AdditionsEdit

