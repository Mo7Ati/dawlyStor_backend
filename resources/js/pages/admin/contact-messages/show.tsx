import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Form, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { ContactMessage } from '@/types/dashboard';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/shared/input-error';
import { Mail, MessageSquare } from 'lucide-react';

const CONTACT_MESSAGES_INDEX = '/admin/contact-messages';

export default function ContactMessageShow({
    contactMessage: message,
}: {
    contactMessage: ContactMessage;
}) {
    const { t } = useTranslation('dashboard');
    const { flash } = usePage().props as { flash?: { success?: string } };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('contact_messages.title') || 'Contact messages', href: CONTACT_MESSAGES_INDEX },
        {
            title: `#${message.id} ${message.subject}`,
            href: `/admin/contact-messages/${message.id}`,
        },
    ];

    const markAsReadUrl = `/admin/contact-messages/${message.id}/read`;
    const replyUrl = `/admin/contact-messages/${message.id}/reply`;

    return (
        <AppLayout
            breadcrumbs={breadcrumbs}
            title={t('contact_messages.message_detail') || `Message #${message.id}`}
        >
            <div className="space-y-6">
                {flash?.success && (
                    <p className="rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-200">
                        {flash.success}
                    </p>
                )}

                <div className="rounded-lg border bg-card p-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                {t('contact_messages.name') || 'Name'}
                            </p>
                            <p className="mt-1">
                                {message.first_name} {message.last_name}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                {t('contact_messages.email') || 'Email'}
                            </p>
                            <p className="mt-1">{message.email}</p>
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm font-medium text-muted-foreground">
                            {t('contact_messages.subject') || 'Subject'}
                        </p>
                        <p className="mt-1 font-medium">{message.subject}</p>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm font-medium text-muted-foreground">
                            {t('contact_messages.message') || 'Message'}
                        </p>
                        <p className="mt-1 whitespace-pre-wrap">{message.message}</p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <span>
                            {t('contact_messages.created_at') || 'Created'}:{' '}
                            {message.created_at
                                ? new Date(message.created_at).toLocaleString()
                                : '—'}
                        </span>
                        {message.read_at && (
                            <span>
                                · {t('contact_messages.read') || 'Read'}:{' '}
                                {new Date(message.read_at).toLocaleString()}
                            </span>
                        )}
                        {message.replied_at && (
                            <span>
                                · {t('contact_messages.replied') || 'Replied'}:{' '}
                                {new Date(message.replied_at).toLocaleString()}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {!message.read_at && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                router.patch(markAsReadUrl, {}, { preserveScroll: true })
                            }
                        >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            {t('contact_messages.mark_as_read') || 'Mark as read'}
                        </Button>
                    )}
                </div>

                {!message.replied_at && (
                    <div className="rounded-lg border bg-card p-6">
                        <h3 className="mb-4 flex items-center gap-2 font-medium">
                            <Mail className="h-4 w-4" />
                            {t('contact_messages.reply_via_email') || 'Reply via email'}
                        </h3>
                        <Form
                            method="post"
                            action={replyUrl}
                            className="space-y-4"
                            options={{ preserveScroll: true }}
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="reply_message">
                                            {t('contact_messages.reply_message') || 'Your reply'}
                                        </Label>
                                        <Textarea
                                            id="reply_message"
                                            name="reply_message"
                                            rows={6}
                                            required
                                            placeholder={
                                                t('contact_messages.reply_placeholder') ||
                                                'Type your reply to the customer...'
                                            }
                                        />
                                        <InputError message={errors.reply_message} />
                                    </div>
                                    <Button type="submit" disabled={processing}>
                                        {processing
                                            ? t('contact_messages.sending') || 'Sending...'
                                            : t('contact_messages.send_reply') || 'Send reply'}
                                    </Button>
                                </>
                            )}
                        </Form>
                    </div>
                )}

                {message.replied_at && (
                    <p className="text-sm text-muted-foreground">
                        {t('contact_messages.replied_on') || 'Replied on'}{' '}
                        {new Date(message.replied_at).toLocaleString()}.
                    </p>
                )}
            </div>
        </AppLayout>
    );
}
