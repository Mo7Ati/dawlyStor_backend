import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
import { App } from '@/wayfinder/types';
import { useTranslation } from 'react-i18next'
import CategoryForm from './components/category-form'
import CategoryController from '@/wayfinder/App/Http/Controllers/dashboard/store/CategoryController'

const CategoriesEdit = ({ category }: { category: App.Models.Category }) => {
    const { t } = useTranslation('dashboard')

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('categories.title'),
            href: CategoryController.index.url(),
        },
        {
            title: t('categories.edit'),
            href: CategoryController.edit.url({ category: Number(category.id) }),
        },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs} title={t('categories.edit')}>
            <CategoryForm category={category} type="edit" />
        </AppLayout>
    )
}

export default CategoriesEdit
