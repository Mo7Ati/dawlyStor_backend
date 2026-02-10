import { Form, router } from '@inertiajs/react'
import { useTranslation } from 'react-i18next'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { App } from '@/wayfinder/types';
import FormButtons from '@/components/form/form-buttons'
import { normalizeFieldValue } from '@/lib/utils'
import TranslatableTabs from '@/components/ui/translatable-tabs'
import IsActive from '@/components/form/is-active'
import FileUpload from '@/components/form/file-upload'
import CategoryController from '@/wayfinder/App/Http/Controllers/dashboard/store/CategoryController'

interface CategoryFormProps {
    category: App.Models.Category
    type: 'create' | 'edit'
}

export default function CategoryForm({ category, type }: CategoryFormProps) {
    const { t } = useTranslation('forms')

    return (
        <Form
            method={type === 'edit' ? 'put' : 'post'}
            action={
                (type === 'edit' && category.id)
                    ? CategoryController.update.url({ category: Number(category.id) })
                    : CategoryController.store.url()
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
                                        label: t('categories.name'),
                                        type: 'text',
                                        value: normalizeFieldValue(category.name),
                                        placeholder: t('categories.enter_name'),
                                    },
                                    {
                                        name: 'description',
                                        label: t('categories.description'),
                                        type: 'textarea',
                                        value: normalizeFieldValue(category.description),
                                    },
                                ]}
                                errors={errors}
                            />
                        </div>

                        {/* Right column – settings */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('categories.category_settings')}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <IsActive value={category.is_active ?? true} />
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <FormButtons
                        processing={processing}
                        handleCancel={() => router.visit(CategoryController.index.url())}
                        isEditMode={type === 'edit'}
                    />
                </>
            )}
        </Form>
    )
}
