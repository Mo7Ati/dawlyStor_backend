import { Form, router } from '@inertiajs/react'
import { useTranslation } from 'react-i18next'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { App } from '@/wayfinder/types';
import FormButtons from '@/components/form/form-buttons'
import { normalizeFieldValue } from '@/lib/utils'
import TranslatableTabs from '@/components/ui/translatable-tabs'
import IsActive from '@/components/form/is-active'
import AdditionController from '@/wayfinder/App/Http/Controllers/dashboard/store/AdditionController'

interface AdditionFormProps {
    addition: App.Models.Addition
    type: 'create' | 'edit'
}

export default function AdditionForm({ addition, type }: AdditionFormProps) {
    const { t } = useTranslation('forms')

    return (
        <Form
            method={type === 'edit' ? 'put' : 'post'}
            action={
                (type === 'edit' && addition.id)
                    ? AdditionController.update.url({ addition: Number(addition.id) })
                    : AdditionController.store.url()
            }
        >
            {({ processing, errors }) => (
                <>
                    <div className="space-y-6 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0">
                        {/* Left column – main translatable fields */}
                        <div className="lg:col-span-2 space-y-6">
                            <TranslatableTabs
                                fields={[
                                    {
                                        name: 'name',
                                        label: t('additions.name'),
                                        type: 'text',
                                        value: normalizeFieldValue(addition.name),
                                        placeholder: t('additions.enter_name'),
                                    },
                                ]}
                                errors={errors}
                            />
                        </div>

                        {/* Right column – settings */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('additions.addition_settings')}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <IsActive value={addition.is_active ?? true} />
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <FormButtons
                        processing={processing}
                        handleCancel={() => router.visit(AdditionController.index.url())}
                        isEditMode={type === 'edit'}
                    />
                </>
            )}
        </Form>
    )
}

