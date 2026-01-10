import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
import { Head } from '@inertiajs/react'
import { useTranslation } from 'react-i18next'
import SectionForm from './components/section-form'
import { Section } from '@/types/dashboard'
import sections from '@/routes/admin/sections'

const SectionsEdit = ({
    section,
    sectionTypes,
    products,
    categories,
    stores,
}: {
    section: Section
    sectionTypes: Record<string, string>
    products?: Array<{ id: number | string; name: string | Record<string, string> }>
    categories?: Array<{ id: number | string; name: string | Record<string, string> }>
    stores?: Array<{ id: number | string; name: string | Record<string, string> }>
}) => {
    const { t } = useTranslation('dashboard');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('sections.title') || 'Sections',
            href: sections.index.url(),
        },
        {
            title: t('sections.edit') || 'Edit Section',
            href: sections.edit.url({ section: section.id }),
        },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs} >
            <Head title={t('sections.edit') || 'Edit Section'} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <SectionForm
                    section={section}
                    sectionTypes={sectionTypes}
                    products={products}
                    categories={categories}
                    stores={stores}
                    type="edit"
                />
            </div>
        </AppLayout >
    )
}

export default SectionsEdit
