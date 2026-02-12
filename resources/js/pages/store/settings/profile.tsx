import HeadingSmall from '@/components/shared/heading-small'
import React, { useState } from 'react'
import { Form, router } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { useTranslation } from 'react-i18next'
import { type BreadcrumbItem } from '@/types'
import { Store, StoreCategory } from '@/types/dashboard'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import InputError from '@/components/shared/input-error'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import TranslatableTabs from '@/components/ui/translatable-tabs'
import MultiInput from '@/components/form/multi-input'
import FileUpload from '@/components/form/file-upload'
import FormButtons from '@/components/form/form-buttons'
import { normalizeFieldValue } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Transition } from '@headlessui/react'
import SettingsLayout from '@/layouts/settings/layout'
import settings from '@/routes/store/settings'

interface StoreProfileSettingsProps {
    store: Store
    storeCategories: StoreCategory[]
}

const StoreProfileSettings = ({ store, storeCategories }: StoreProfileSettingsProps) => {
    const { t: tSettings } = useTranslation('settings')
    const { t: tForms } = useTranslation('forms')

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: tSettings('profile.page_title'),
            href: settings.profile.url(),
        },
    ]

    const [keywords, setKeywords] = useState<string[]>(store.keywords ?? []);

    return (
        <AppLayout breadcrumbs={breadcrumbs} title={tSettings('profile.page_title')}>
            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title={tSettings('profile.heading_title')}
                        description={tSettings('profile.heading_description')}
                    />

                    <Form
                        method="PUT"
                        action={settings.profile.url()}
                        options={{
                            preserveScroll: true,
                        }}
                        transform={data => ({
                            ...data,
                            keywords,
                        })}
                    >
                        {({ processing, errors, recentlySuccessful }) => (
                            <div className="space-y-6">
                                <div className="space-y-6 max-w-2xl">
                                    <TranslatableTabs
                                        fields={[
                                            {
                                                name: 'name',
                                                label: tForms('stores.name'),
                                                type: 'text',
                                                value: normalizeFieldValue(store.name),
                                                placeholder: tForms('stores.enter_name'),
                                            },
                                            {
                                                name: 'description',
                                                label: tForms('stores.description'),
                                                type: 'textarea',
                                                value: normalizeFieldValue(store.description),
                                            },
                                            {
                                                name: 'address',
                                                label: tForms('stores.address'),
                                                type: 'text',
                                                value: normalizeFieldValue(store.address),
                                                placeholder: tForms('stores.enter_address'),
                                            },
                                        ]}
                                        errors={errors}
                                    />

                                    {/* Email */}
                                    <div>
                                        <Label htmlFor="email">{tForms('stores.email')}</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            defaultValue={store.email}
                                            placeholder={tForms('stores.enter_email')}
                                            aria-invalid={errors.email ? 'true' : 'false'}
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    {/* Store Category */}
                                    <div className="space-y-2">
                                        <Label htmlFor="category_id">{tForms('stores.store_category')}</Label>
                                        <Select
                                            defaultValue={store.category_id ? String(store.category_id) : undefined}
                                            name="category_id"
                                        >
                                            <SelectTrigger
                                                id="category_id"
                                                aria-invalid={errors.category_id ? 'true' : 'false'}
                                            >
                                                <SelectValue placeholder={tForms('stores.select_category')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {storeCategories.map((category) => (
                                                    <SelectItem
                                                        key={category.id}
                                                        value={String(category.id)}
                                                    >
                                                        {typeof category.name === 'string'
                                                            ? category.name
                                                            : category.name.ar || category.name.en || ''}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.category_id} />
                                    </div>

                                    {/* Keywords */}
                                    <div className="space-y-2">
                                        <Label htmlFor="keywords">{tForms('products.keywords')}</Label>
                                        <MultiInput
                                            id="keywords"
                                            name="keywords"
                                            placeholder={tForms('products.enter_keywords')}
                                            value={keywords}
                                            onChange={setKeywords}
                                        />
                                        <InputError message={errors.keywords as string} />
                                    </div>

                                    {/* Store Logo */}
                                    <div className="space-y-2">
                                        <FileUpload
                                            name="temp_ids"
                                            label={tForms('stores.store_logo')}
                                            multiple={false}
                                            required={false}
                                            acceptedFileTypes={['image/*']}
                                            maxFiles={1}
                                            maxFileSize="5MB"
                                            error={errors.temp_ids}
                                            files={store.logo}
                                        />
                                    </div>

                                    {/* Phone Number */}
                                    <div>
                                        <Label htmlFor="phone">{tForms('stores.phone_number')}</Label>
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

                                    {/* Delivery Time */}
                                    <div>
                                        <Label htmlFor="delivery_time">{tForms('stores.delivery_time')}</Label>
                                        <Input
                                            id="delivery_time"
                                            name="delivery_time"
                                            type="number"
                                            required
                                            min="1"
                                            defaultValue={store.delivery_time}
                                            aria-invalid={errors.delivery_time ? 'true' : 'false'}
                                        />
                                        <span className="text-muted-foreground text-xs">
                                            {tForms('stores.delivery_time_desc')}
                                        </span>
                                        <InputError message={errors.delivery_time} />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Button
                                        disabled={processing}
                                        data-test="update-profile-button"
                                    >
                                        {tSettings('general.save')}
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-neutral-600">
                                            {tSettings('general.saved')}
                                        </p>
                                    </Transition>
                                </div>
                            </div>
                        )}
                    </Form>
                </div >
            </SettingsLayout >
        </AppLayout >
    )
}

export default StoreProfileSettings
