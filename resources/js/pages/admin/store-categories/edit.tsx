import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
import { App } from '@/wayfinder/types';
import { useTranslation } from 'react-i18next'
import StoreCategoryForm from './components/store-category-form'
import StoreCategoryController from '@/wayfinder/App/Http/Controllers/dashboard/admin/StoreCategoryController';


const StoreCategoriesEdit = ({ category }: { category: App.Models.StoreCategory }) => {
    const { t } = useTranslation('dashboard');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('store_categories.title'),
            href: StoreCategoryController.index.url(),
        },
        {
            title: t('store_categories.edit'),
            href: StoreCategoryController.edit.url({ store_category: category.id }),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs} title={t('store_categories.edit')}>
            <StoreCategoryForm category={category} type="edit" />
        </AppLayout>
    )
}

export default StoreCategoriesEdit

