import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
import { App } from '@/wayfinder/types';
import { useTranslation } from 'react-i18next'
import StoreForm from './components/store-form'
import StoreController from '@/wayfinder/App/Http/Controllers/dashboard/admin/StoreController'
    
const StoresEdit = ({ store, categories }: { store: App.Models.Store; categories: App.Models.StoreCategory[] }) => {
    const { t } = useTranslation('dashboard');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('stores.title'),
            href: StoreController.index.url(),
        },
        {
            title: t('stores.edit'),
            href: StoreController.edit.url({ store: store.id.toString() }),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs} title={t('stores.edit')}>
            <StoreForm store={store} categories={categories} type="edit" />
        </AppLayout>
    )
}

export default StoresEdit

