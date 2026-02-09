import { usePage } from '@inertiajs/react';

import AppearanceTabs from '@/components/settings/appearance-tabs';
import HeadingSmall from '@/components/shared/heading-small';
import { SharedData, type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { useTranslation } from 'react-i18next';


export default function Appearance() {
    const { t } = useTranslation('settings');
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('appearance.page_title'),
            href: '',
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs} title={t('appearance.page_title')}>
            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title={t('appearance.heading_title')}
                        description={t('appearance.heading_description')}
                    />
                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
