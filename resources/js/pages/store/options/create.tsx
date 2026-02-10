import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
import { useTranslation } from 'react-i18next'
import OptionForm from './components/option-form'
import { App } from '@/wayfinder/types';
import OptionController from '@/wayfinder/App/Http/Controllers/dashboard/store/OptionController'

const OptionsCreate = ({ option }: { option: App.Models.Option }) => {
    const { t } = useTranslation('dashboard')

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('options.title'),
            href: OptionController.index.url(),
        },
        {
            title: t('options.create'),
            href: OptionController.create.url(),
        },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs} title={t('options.create')}>
            <OptionForm option={option} type="create" />
        </AppLayout>
    )
}

export default OptionsCreate

