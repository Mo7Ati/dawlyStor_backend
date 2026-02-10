import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
import { useTranslation } from 'react-i18next'
import SectionForm from './components/section-form'
import SectionController from '@/wayfinder/App/Http/Controllers/dashboard/admin/SectionController'
import { SectionEnum } from '@/wayfinder/App/Enums/SectionEnum'
import { App } from '@/wayfinder/types';

const SectionsEdit = ({
    section,
    sectionTypes,
    products,
    categories,
    stores,
}: {
    section: App.Models.Section
    sectionTypes: typeof SectionEnum
    products?: App.Models.Product[]
    categories?: App.Models.Category[]
    stores?: App.Models.Store[]
}) => {
    const { t } = useTranslation('dashboard');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('sections.title') || 'Sections',
            href: SectionController.index.url(),
        },
        {
            title: t('sections.edit') || 'Edit Section',
            href: SectionController.edit.url({ section: section.id }),
        },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs} title={t('sections.edit') || 'Edit Section'}>
            <SectionForm
                section={section}
                sectionTypes={sectionTypes}
                products={products}
                categories={categories}
                stores={stores}
                type="edit"
            />
        </AppLayout>
    )
}

export default SectionsEdit
