import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
import { useTranslation } from 'react-i18next'
import StoreForm from './components/store-form'
import StoreController from '@/wayfinder/App/Http/Controllers/dashboard/admin/StoreController'
import { App } from '@/wayfinder/types';

const StoresCreate = ({ store, categories }: { store: App.Models.Store; categories: App.Models.StoreCategory[] }) => {
    const { t } = useTranslation('dashboard');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('stores.title'),
            href: StoreController.index.url(),
        },
        {
            title: t('stores.create'),
            href: StoreController.create.url(),
        },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs} title={t('stores.create')}>
            <StoreForm store={store} categories={categories} type="create" />
        </AppLayout>
    )
}

export default StoresCreate

