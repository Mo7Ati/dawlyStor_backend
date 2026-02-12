import { Form, router } from '@inertiajs/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Store, StoreCategory } from '@/types/dashboard'
import FormButtons from '@/components/form/form-buttons'
import { normalizeFieldValue } from '@/lib/utils'
import TranslatableTabs from '@/components/ui/translatable-tabs'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import InputError from '@/components/shared/input-error'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import IsActive from '@/components/form/is-active'
import FileUpload from '@/components/form/file-upload'
import { create, index, update } from '@/routes/admin/stores'
import { MultiSelect } from '@/components/ui/multi-select'


interface StoreFormProps {
    store: Store;
    categories: StoreCategory[];
    type: 'create' | 'edit';
}

export default function StoreForm({ store, categories, type }: StoreFormProps) {
    const { t } = useTranslation('forms');

    return (
        <Form
            method={type === 'edit' ? 'put' : 'post'}
            action={
                (type === 'edit' && store.id)
                    ? update({ store: store.id })
                    : create()
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
                                        label: t('common.name'),
                                        type: 'text',
                                        value: normalizeFieldValue(store.name),
                                        placeholder: t('stores.enter_name'),
                                    },
                                    {
                                        name: 'description',
                                        label: t('common.description'),
                                        type: 'textarea',
                                        value: normalizeFieldValue(store.description),
                                    },
                                    {
                                        name: 'address',
                                        label: t('stores.address'),
                                        type: 'text',
                                        value: normalizeFieldValue(store.address),
                                        placeholder: t('stores.enter_address'),
                                    },
                                ]}
                                errors={errors}
                            />

                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('stores.store_category')}</CardTitle>
                                    <CardDescription>
                                        {t('stores.select_category')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div>
                                        <Label htmlFor="category_id">{t('stores.store_category')}</Label>
                                        <Select
                                            defaultValue={String(store.category_id)}
                                            name='category_id'
                                        >
                                            <SelectTrigger id="category_id" aria-invalid={errors.category_id ? 'true' : 'false'}>
                                                <SelectValue defaultValue={String(store.category_id)} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="null" disabled>{t('stores.no_category')}</SelectItem>
                                                {categories.map((category) => (
                                                    <SelectItem
                                                        key={category.id}
                                                        value={String(category.id)}
                                                    >
                                                        {category.name as string}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.category_id} />
                                    </div>
                                </CardContent>
                            </Card>


                            <Card>
                                <CardHeader className='relative'>
                                    <CardTitle>{t('stores.store_images')}</CardTitle>
                                    <CardDescription>
                                        {t('stores.store_images_desc')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FileUpload
                                        name="logo_temp_id"
                                        label={t('stores.store_logo')}
                                        multiple={false}
                                        required
                                        acceptedFileTypes={['image/*']}
                                        maxFiles={1}
                                        maxFileSize="5MB"
                                        error={errors.temp_ids}
                                        files={store.logo}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right column – credentials & settings */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('stores.store_credentials')}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="email">{t('stores.email')}</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            defaultValue={store.email}
                                            placeholder={t('stores.enter_email')}
                                            aria-invalid={errors.email ? 'true' : 'false'}
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div>
                                        <Label htmlFor="password">{t('common.password')}</Label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required={type === 'create'}
                                            aria-invalid={errors.password ? 'true' : 'false'}
                                        />
                                        <span className="text-muted-foreground text-xs">
                                            {type === 'create'
                                                ? t('stores.enter_password')
                                                : t('stores.leave_blank')}
                                        </span>
                                        <InputError message={errors.password} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('stores.store_settings')}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="phone">{t('stores.phone_number')}</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="text"
                                            required
                                            defaultValue={store.phone}
                                            aria-invalid={errors.phone ? 'true' : 'false'}
                                        />
                                        <InputError message={errors.phone} />
                                    </div>
                                    <div>
                                        <Label htmlFor="delivery_time">{t('stores.delivery_time')}</Label>
                                        <Input
                                            id="delivery_time"
                                            name="delivery_time"
                                            type="number"
                                            defaultValue={store.delivery_time}
                                            aria-invalid={errors.delivery_time ? 'true' : 'false'}
                                        />
                                        <span className="text-muted-foreground text-xs">
                                            {t('stores.delivery_time_desc')}
                                        </span>
                                        <InputError message={errors.delivery_time} />
                                    </div>

                                    <IsActive value={store.is_active ?? true} />
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <FormButtons
                        processing={processing}
                        handleCancel={() => router.visit(index())}
                        isEditMode={type === 'edit'}
                    />
                </>
            )}
        </Form>
    )
}

