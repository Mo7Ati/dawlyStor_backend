// Components
import TextLink from '@/components/shared/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { SharedData } from '@/types';
import { Form, Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function VerifyEmail({ status }: { status?: string }) {
    const { t } = useTranslation("auth");
    const { panel } = usePage<SharedData>().props;
    return (
        <AuthLayout
            title={t('verify_email_title')}
            description={t('verify_email_description')}
        >
            <Head title={t('email_verification')} />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {t('verification_link_sent')}
                </div>
            )}

            <Form method="post" action={`/${panel}/verify-email`} className="space-y-6 text-center">
                {({ processing }) => (
                    <>
                        <Button disabled={processing} variant="secondary">
                            {processing && <Spinner />}
                            {t('resend_verification_email')}
                        </Button>

                        <TextLink
                            href={`/${panel}/logout`}
                            className="mx-auto block text-sm"
                        >
                            {t('log_out')}
                        </TextLink>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
