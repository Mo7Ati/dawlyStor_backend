import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Form } from '@inertiajs/react';

import HeadingSmall from '@/components/shared/heading-small';
import InputError from '@/components/shared/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { useTranslation } from 'react-i18next';

export default function PlatformFees({
    settings,
}: {
    settings: {
        platform_fee_percentage: number;
        delivery_fee: number;
        tax_percentage: number;
    };
}) {
    const { t } = useTranslation('settings');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('platform_fees.page_title'),
            href: '/admin/settings/platform-fees',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs} title={t('platform_fees.page_title')}>
            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title={t('platform_fees.heading_title')}
                        description={t('platform_fees.heading_description')}
                    />

                    <Form
                        method="PUT"
                        action="/admin/settings/platform-fees"
                        options={{
                            preserveScroll: true,
                        }}
                        className="space-y-6"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="platform_fee_percentage">
                                        {t('platform_fees.commission_percentage')}
                                    </Label>
                                    <Input
                                        id="platform_fee_percentage"
                                        type="number"
                                        step="0.01"
                                        min={0}
                                        max={100}
                                        className="mt-1 block w-full"
                                        defaultValue={settings.platform_fee_percentage}
                                        name="platform_fee_percentage"
                                        required
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.platform_fee_percentage}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="delivery_fee">
                                        {t('platform_fees.delivery_fee')}
                                    </Label>
                                    <Input
                                        id="delivery_fee"
                                        type="number"
                                        step="0.01"
                                        min={0}
                                        className="mt-1 block w-full"
                                        defaultValue={settings.delivery_fee}
                                        name="delivery_fee"
                                        required
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.delivery_fee}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="tax_percentage">
                                        {t('platform_fees.tax_percentage')}
                                    </Label>
                                    <Input
                                        id="tax_percentage"
                                        type="number"
                                        step="0.01"
                                        min={0}
                                        max={100}
                                        className="mt-1 block w-full"
                                        defaultValue={settings.tax_percentage}
                                        name="tax_percentage"
                                        required
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.tax_percentage}
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <Button
                                        disabled={processing}
                                        data-test="update-platform-fees-button"
                                    >
                                        {t('platform_fees.save')}
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-neutral-600">
                                            {t('platform_fees.saved')}
                                        </p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
