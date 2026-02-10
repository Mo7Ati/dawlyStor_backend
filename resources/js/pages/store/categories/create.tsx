import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
import { useTranslation } from 'react-i18next'
import CategoryForm from './components/category-form'
import { App } from '@/wayfinder/types';
import CategoryController from '@/wayfinder/App/Http/Controllers/dashboard/store/CategoryController'

const CategoriesCreate = ({ category }: { category: App.Models.Category }) => {
    const { t } = useTranslation('dashboard')

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('categories.title'),
            href: CategoryController.index.url(),
        },
        {
            title: t('categories.create'),
            href: CategoryController.create.url(),
        },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs} title={t('categories.create')}>
            <CategoryForm category={category} type="create" />
        </AppLayout>
    )
}

export default CategoriesCreate
