import { Form, router } from '@inertiajs/react'
import { useTranslation } from 'react-i18next'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Field, StoreCategory } from '@/types/dashboard'
import FormButtons from '@/components/form/form-buttons'
import TranslatableTabs from '@/components/ui/translatable-tabs'
import { normalizeFieldValue } from '@/lib/utils'
import StoreCategoryController from '@/wayfinder/App/Http/Controllers/dashboard/admin/StoreCategoryController'
import { App } from '@/wayfinder/types'

interface StoreCategoryFormProps {
    category: App.Models.StoreCategory;
    type: 'create' | 'edit';
}

export default function StoreCategoryForm({ category, type }: StoreCategoryFormProps) {
    const { t } = useTranslation('forms');

    const fields: Field[] = [
        {
            name: 'name',
            label: t('store_categories.name'),
            type: 'text',
            value: normalizeFieldValue(category.name),
            required: true,
        },
        {
            name: 'description',
            label: t('store_categories.description'),
            type: 'textarea',
            value: normalizeFieldValue(category.description),
            required: false,
        },
    ];

    return (
        <Form
            method={type === 'edit' ? 'put' : 'post'}
            action={
                (type === 'edit' && category.id)
                    ? StoreCategoryController.update.url({ store_category: category.id })
                    : StoreCategoryController.store.url()
            }
        >
            {({ processing, errors }) => (
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {type === 'create' ? t('store_categories.create_category') : t('store_categories.edit_category')}
                        </CardTitle>
                        <CardDescription>
                            {type === 'create' ? t('store_categories.add_new_category') : t('store_categories.update_category_info')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <TranslatableTabs fields={fields} errors={errors} />
                    </CardContent>
                    <CardFooter>
                        <FormButtons
                            handleCancel={() => router.visit(StoreCategoryController.index.url())}
                            processing={processing}
                            isEditMode={type === 'edit'}
                        />
                    </CardFooter>
                </Card>
            )}
        </Form>
    );
}

