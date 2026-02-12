import { Form, router } from '@inertiajs/react'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Section } from '@/types/dashboard'
import FormButtons from '@/components/form/form-buttons'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { MultiSelect } from '@/components/ui/multi-select'
import InputError from '@/components/shared/input-error'
import sections from '@/routes/admin/sections'
import IsActiveFormField from '@/components/form/is-active'
import TranslatableTabs from '@/components/ui/translatable-tabs'
import { normalizeFieldValue } from '@/lib/utils'
import { Icon } from '@/components/shared/icon'
import { IconPicker } from '@/components/ui/icon-picker'

interface SectionFormProps {
    section: Section;
    sectionTypes: Record<string, string>;
    products?: Array<{ id: number | string; name: string | Record<string, string> }>;
    categories?: Array<{ id: number | string; name: string | Record<string, string> }>;
    stores?: Array<{ id: number | string; name: string | Record<string, string> }>;
    type: 'create' | 'edit';
}

export default function SectionForm({
    section,
    sectionTypes,
    products = [],
    categories = [],
    stores = [],
    type
}: SectionFormProps) {
    const { t } = useTranslation('forms');

    const [sectionType, setSectionType] = useState<string>(section.type);
    const [sectionData, setSectionData] = useState<any>(section.data);

    useEffect(() => {
        if (type === 'create') {
            setSectionData([]);
        }
    }, [sectionType, type]);

    console.log(sectionData);

    return (
        <Form
            method={type === 'edit' ? 'put' : 'post'}
            action={
                (type === 'edit' && section.id)
                    ? sections.update.url({ section: section.id })
                    : sections.store.url()
            }
            transform={prev => {
                // Preserve form-collected data from inputs (formData takes precedence)
                const formData = prev.data as any || {};
                // Merge sectionData for non-input fields (like source, product_ids, etc.)
                // but form-collected data (from inputs) takes precedence
                return {
                    ...prev,
                    data: {
                        ...sectionData,
                        ...formData  // Form inputs override sectionData
                    }
                };
            }}
        >
            {({ processing, errors }) => (
                <div>
                    <div className="space-y-4">
                        {/* Section Header */}
                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        {type === 'create' ? t('sections.create_section') : t('sections.edit_section')}
                                    </CardTitle>
                                    <CardDescription>
                                        {type === 'create' ? t('sections.create_section_info') : t('sections.edit_section_info')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Type Selector */}
                                    <div className="space-y-2">
                                        <Label htmlFor="type">{t('sections.type')}</Label>
                                        <Select
                                            defaultValue={sectionType || undefined}
                                            onValueChange={(value) => setSectionType(value)}
                                            name='type'
                                            aria-invalid={errors.type ? 'true' : 'false'}
                                            required={true}
                                        >
                                            <SelectTrigger id="type">
                                                <SelectValue placeholder={t('sections.select_section_type')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(sectionTypes).map(([value, label]) => (
                                                    <SelectItem key={value} value={value}>
                                                        {t(`sections.types.${value}`)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.type} />
                                    </div>

                                    {/* Is Active */}
                                    <IsActiveFormField value={section.is_active || true} />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Section Type Details */}
                        <div>
                            <Card hidden={!sectionType}>
                                <CardHeader>
                                    <CardTitle>
                                        {t('sections.section_type_details')}
                                    </CardTitle>
                                    <CardDescription>
                                        {t('sections.section_type_details_info')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Hero Section Fields */}
                                    {sectionType === 'hero' && (
                                        <TranslatableTabs
                                            fields={[
                                                {
                                                    name: 'data.title',
                                                    label: t('common.title'),
                                                    type: 'text',
                                                    value: normalizeFieldValue(section.data?.title),
                                                    required: true,
                                                },
                                                {
                                                    name: 'data.description',
                                                    label: t('common.description'),
                                                    type: 'textarea',
                                                    value: normalizeFieldValue(section.data?.description),
                                                    required: true,
                                                },
                                            ]}
                                            errors={errors}
                                        />
                                    )}

                                    {/* Features Section Fields */}
                                    {sectionType === 'features' && (
                                        <div className="grid grid-cols-2 gap-4">
                                            {[0, 1, 2, 3].map((index) => (
                                                <div key={index}>
                                                    <Card>
                                                        <CardContent>
                                                            <TranslatableTabs
                                                                fields={[
                                                                    {
                                                                        name: `data.features.${index}.title`,
                                                                        label: t('sections.feature'),
                                                                        type: 'text',
                                                                        value: normalizeFieldValue(section.data?.features?.[index]?.title),
                                                                        required: true,
                                                                    },
                                                                    {
                                                                        name: `data.features.${index}.description`,
                                                                        label: t('sections.description'),
                                                                        type: 'text',
                                                                        value: normalizeFieldValue(section.data?.features?.[index]?.description),
                                                                    },
                                                                ]}
                                                                errors={errors}
                                                            />
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            ))}
                                            {errors['data.features'] && (
                                                <div className="col-span-2">
                                                    <InputError message={errors['data.features']} />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {/* Products Section Fields */}
                                    {sectionType === 'products' && (
                                        <div className="space-y-4">
                                            <TranslatableTabs
                                                fields={[
                                                    {
                                                        name: 'data.title',
                                                        label: t('common.title'),
                                                        type: 'text',
                                                        value: normalizeFieldValue(section.data?.title),
                                                        required: true,
                                                    },
                                                    {
                                                        name: 'data.description',
                                                        label: t('common.description'),
                                                        type: 'text',
                                                        value: normalizeFieldValue(section.data?.description),
                                                    },
                                                ]}
                                                errors={errors}
                                            />
                                            <div className="space-y-2">
                                                <Label htmlFor="sectionData.source">{t('sections.source')}</Label>
                                                <Select
                                                    onValueChange={value => setSectionData((prev: any) => ({ ...prev, source: value }))}
                                                    defaultValue={section.data?.source || undefined}
                                                >
                                                    <SelectTrigger id="sectionData.source">
                                                        <SelectValue placeholder={t('sections.select_source')} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="latest">{t('sections.products.latest')}</SelectItem>
                                                        <SelectItem value="best_seller">{t('sections.products.best_seller')}</SelectItem>
                                                        <SelectItem value="manual">{t('sections.manual_selection')}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <InputError message={errors['data.source']} />
                                            </div>

                                            {sectionData?.source === 'manual' && (
                                                <div className="space-y-2">
                                                    <Label>{t('sections.select_products')} *</Label>
                                                    <MultiSelect
                                                        defaultValue={section.data?.product_ids || []}
                                                        options={products.map(p => ({
                                                            value: String(p.id),
                                                            label: typeof p.name === 'string' ? p.name : (p.name.en || p.name.ar || String(p.id))
                                                        }))}
                                                        onValueChange={(value) => setSectionData((prev: any) => ({ ...prev, product_ids: value }))}
                                                        placeholder={t('sections.select_products_placeholder')}
                                                    />
                                                    <InputError message={errors['data.product_ids']} />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {/* Categories Section Fields */}
                                    {sectionType === 'categories' && (
                                        <div className="space-y-4">
                                            <TranslatableTabs
                                                fields={[
                                                    {
                                                        name: 'data.title',
                                                        label: t('common.title'),
                                                        type: 'text',
                                                        value: normalizeFieldValue(section.data?.title),
                                                        required: true,
                                                    },
                                                    {
                                                        name: 'data.description',
                                                        label: t('common.description'),
                                                        type: 'text',
                                                        value: normalizeFieldValue(section.data?.description),
                                                    },
                                                ]}
                                                errors={errors}
                                            />
                                            <div className="space-y-2">
                                                <Label htmlFor="sectionData.source">{t('sections.source')}</Label>
                                                <Select
                                                    defaultValue={section.data?.source || undefined}
                                                    onValueChange={(value) => {
                                                        setSectionData((prev: any) => ({ ...prev, source: value }));
                                                    }}
                                                >
                                                    <SelectTrigger id="sectionData.source">
                                                        <SelectValue placeholder={t('sections.select_source')} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="featured_only">{t('sections.categories.featured_only')}</SelectItem>
                                                        <SelectItem value="manual">{t('sections.manual_selection')}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <InputError message={errors['data.source']} />
                                            </div>

                                            {sectionData?.source === 'manual' && (
                                                <div className="space-y-2">
                                                    <Label>{t('sections.select_categories')} *</Label>
                                                    <MultiSelect
                                                        defaultValue={section.data?.category_ids || []}
                                                        options={categories.map(c => ({
                                                            value: String(c.id),
                                                            label: typeof c.name === 'string' ? c.name : (c.name.en || c.name.ar || String(c.id))
                                                        }))}
                                                        onValueChange={(value) => setSectionData((prev: any) => ({ ...prev, category_ids: value }))}
                                                        placeholder={t('sections.select_categories_placeholder')}
                                                    />
                                                    <InputError message={errors['data.category_ids']} />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {/* Stores Section Fields */}
                                    {sectionType === 'stores' && (
                                        <div className="space-y-4">
                                            <TranslatableTabs
                                                fields={[
                                                    {
                                                        name: 'data.title',
                                                        label: t('common.title'),
                                                        type: 'text',
                                                        value: normalizeFieldValue(section.data?.title),
                                                        required: true,
                                                    },
                                                    {
                                                        name: 'data.description',
                                                        label: t('common.description'),
                                                        type: 'text',
                                                        value: normalizeFieldValue(section.data?.description),
                                                    },
                                                ]}
                                                errors={errors}
                                            />
                                            <div className="space-y-2">
                                                <Label htmlFor="sectionData.source">{t('sections.source')}</Label>
                                                <Select
                                                    defaultValue={section.data?.source || undefined}
                                                    onValueChange={(value) => {
                                                        setSectionData((prev: any) => ({ ...prev, source: value }));
                                                    }}
                                                >
                                                    <SelectTrigger id="sectionData.source">
                                                        <SelectValue placeholder={t('sections.select_source')} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="trendy">{t('sections.stores.trendy')}</SelectItem>
                                                        <SelectItem value="manual">{t('sections.manual_selection')}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <InputError message={errors['data.source']} />
                                            </div>

                                            {sectionData?.source === 'manual' && (
                                                <div className="space-y-2">
                                                    <Label>{t('sections.select_stores')} *</Label>
                                                    <MultiSelect
                                                        options={stores.map(s => ({
                                                            value: String(s.id),
                                                            label: typeof s.name === 'string' ? s.name : (s.name.en || s.name.ar || String(s.id))
                                                        }))}
                                                        defaultValue={section.data?.store_ids || []}
                                                        onValueChange={(value) => setSectionData((prev: any) => ({ ...prev, store_ids: value }))}
                                                        placeholder={t('sections.select_stores_placeholder')}
                                                    />
                                                    <InputError message={errors['data.store_ids']} />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {/* Vendor CTA Section Fields */}
                                    {sectionType === 'vendor_cta' && (
                                        <div className="space-y-4">
                                            <TranslatableTabs
                                                fields={[
                                                    {
                                                        name: 'data.title',
                                                        label: t('common.title'),
                                                        type: 'text',
                                                        value: normalizeFieldValue(sectionData.title || {}),
                                                        required: true,
                                                    },
                                                    {
                                                        name: 'data.description',
                                                        label: t('common.description'),
                                                        type: 'textarea',
                                                        value: normalizeFieldValue(sectionData.description || {}),
                                                    },
                                                ]}
                                                errors={errors}
                                            />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <FormButtons
                        handleCancel={() => router.visit(sections.index.url())}
                        processing={processing}
                        isEditMode={type === 'edit'}
                    />
                </div>
            )}
        </Form>
    );
}
