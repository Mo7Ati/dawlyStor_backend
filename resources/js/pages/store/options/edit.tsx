import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
import { App } from '@/wayfinder/types';
import { useTranslation } from 'react-i18next'
import OptionForm from './components/option-form'
import OptionController from '@/wayfinder/App/Http/Controllers/dashboard/store/OptionController'

const OptionsEdit = ({ option }: { option: App.Models.Option }) => {
    const { t } = useTranslation('dashboard')

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('options.title'),
            href: OptionController.index.url(),
        },
        {
            title: t('options.edit'),
            href: OptionController.edit.url({ option: Number(option.id) }),
        },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs} title={t('options.edit')}>
            <OptionForm option={option} type="edit" />
        </AppLayout>
    )
}

export default OptionsEdit

