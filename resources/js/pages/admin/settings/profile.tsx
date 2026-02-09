
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Link, usePage } from '@inertiajs/react';

import DeleteUser from '@/components/settings/delete-user';
import HeadingSmall from '@/components/shared/heading-small';
import InputError from '@/components/shared/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { useTranslation } from 'react-i18next';
import settings from '@/routes/admin/settings';
import { Admin } from '@/types/dashboard';



export default function Profile({
    admin,
    mustVerifyEmail,
    status,
}: {
    admin: Admin;
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { t } = useTranslation('settings');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('profile.page_title'),
            href: settings.profile.url(),
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs} title={t('profile.page_title')}>
            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title={t('profile.heading_title')}
                        description={t('profile.heading_description')}
                    />

                    <Form
                        method="PUT"
                        action={settings.profile.url()}
                        options={{
                            preserveScroll: true,
                        }}
                        className="space-y-6"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">{t('profile.name')}</Label>

                                    <Input
                                        id="name"
                                        className="mt-1 block w-full"
                                        defaultValue={admin.name}
                                        name="name"
                                        required
                                        autoComplete="name"
                                        placeholder={t('profile.full_name_placeholder')}
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.name}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">{t('profile.email_address')}</Label>

                                    <Input
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        defaultValue={admin.email}
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder={t('profile.email_address_placeholder')}
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.email}
                                    />
                                </div>

                                {/*  && admin.email_verified_at === null */}
                                {/* {mustVerifyEmail &&
                                    (
                                        <div>
                                            <p className="-mt-4 text-sm text-muted-foreground">
                                                {t('profile.email_unverified')}{' '}
                                                <Link
                                                    href={`/admin/verify-email`}
                                                    as="button"
                                                    className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                                >
                                                    {t('profile.resend_verification')}
                                                </Link>
                                            </p>

                                            {status ===
                                                'verification-link-sent' && (
                                                    <div className="mt-2 text-sm font-medium text-green-600">
                                                        {t('profile.verification_link_sent')}
                                                    </div>
                                                )}
                                        </div>
                                    )
                                } */}

                                <div className="flex items-center gap-4">
                                    <Button
                                        disabled={processing}
                                        data-test="update-profile-button"
                                    >
                                        {t('profile.save')}
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-neutral-600">
                                            {t('profile.saved')}
                                        </p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                {/* <DeleteUser /> */}
            </SettingsLayout>
        </AppLayout>
    );
}
