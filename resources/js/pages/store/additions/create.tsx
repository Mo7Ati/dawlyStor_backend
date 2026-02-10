import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
import { useTranslation } from 'react-i18next'
import AdditionForm from './components/addition-form'
import { App } from '@/wayfinder/types';
import AdditionController from '@/wayfinder/App/Http/Controllers/dashboard/store/AdditionController'

const AdditionsCreate = ({ addition }: { addition: App.Models.Addition }) => {
    const { t } = useTranslation('dashboard')

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('additions.title'),
            href: AdditionController.index.url(),
        },
        {
            title: t('additions.create'),
            href: AdditionController.create.url(),
        },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs} title={t('additions.create')}>
            <AdditionForm addition={addition} type="create" />
        </AppLayout>
    )
}

export default AdditionsCreate

