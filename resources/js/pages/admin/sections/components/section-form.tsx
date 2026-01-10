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
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { MultiSelect } from '@/components/ui/multi-select'
import InputError from '@/components/input-error'
import sections from '@/routes/admin/sections'
import IsActiveFormField from '@/components/form/is-active'
import TranslatableTabs from '@/components/form/translatable-tabs'
import { normalizeFieldValue } from '@/lib/utils'
import { Repeater } from '@/components/repeater'

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

    const [sectionType, setSectionType] = useState<Section['type']>(section.type);
    const [sectionData, setSectionData] = useState<any>(section.data);
    const [features, setFeatures] = useState<any[]>(section.data?.features || []);

    useEffect(() => {
        if (type === 'create') {
            setSectionData([]);
        }
    }, [sectionType, type]);




    return (
        <Form
            method={type === 'edit' ? 'put' : 'post'}
            action={
                (type === 'edit' && section.id)
                    ? sections.update.url({ section: section.id })
                    : sections.store.url()
            }
            transform={prev => ({ ...prev, data: { ...(prev.data as any), ...sectionData } })}
        >
            {({ processing, errors }) => (
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {type === 'create' ? 'Create Section' : 'Edit Section'}
                            </CardTitle>
                            <CardDescription>
                                {type === 'create' ? 'Add a new section to the landing page' : 'Update section information'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Type Selector */}
                            <div className="space-y-2">
                                <Label htmlFor="type">Type *</Label>
                                <Select
                                    defaultValue={sectionType}
                                    onValueChange={(value) => setSectionType(value as Section['type'])}
                                    name='type'
                                    aria-invalid={errors.type ? 'true' : 'false'}
                                >
                                    <SelectTrigger id="type">
                                        <SelectValue placeholder="Select section type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(sectionTypes).map(([value, label]) => (
                                            <SelectItem key={value} value={value}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.type} />
                            </div>

                            {/* Is Active */}
                            <IsActiveFormField value={section.is_active} />
                        </CardContent>
                    </Card>


                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Section Type Details
                            </CardTitle>
                            <CardDescription>
                                update the details of the section type to display on the home page
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Hero Section Fields */}
                            {sectionType === 'hero' && (
                                <>
                                    <TranslatableTabs
                                        fields={[
                                            {
                                                name: 'data[title]',
                                                label: t('sections.title') || 'Title',
                                                type: 'text',
                                                value: normalizeFieldValue(section.data?.title),
                                                required: true,
                                            },
                                            {
                                                name: 'data[sub_title]',
                                                label: t('sections.subtitle') || 'Subtitle',
                                                type: 'text',
                                                value: normalizeFieldValue(section.data?.sub_title),
                                            },
                                        ]}
                                        errors={errors}
                                    />
                                </>
                            )}
                            {/* Features Section Fields */}
                            {sectionType === 'features' && (
                                <div className="space-y-4">
                                    <Repeater
                                        name="data[features]"
                                        value={features}
                                        onChange={e => {
                                            setFeatures(e.target.value)
                                        }}
                                        createItem={() => ({
                                            icon: '',
                                            title: { en: '', ar: '' },
                                            description: { en: '', ar: '' },
                                        })}
                                        renderRow={(item, index, update) => (
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label>Icon Name</Label>
                                                    <Input
                                                        defaultValue={item.icon || ''}
                                                        onChange={(e) => update({ icon: e.target.value })}
                                                        placeholder="e.g., LayoutGrid, BookOpen"
                                                        name={`data.features.${index}.icon`}
                                                    />
                                                    <InputError message={errors['data.features.icon']} />
                                                </div>
                                                <TranslatableTabs
                                                    fields={[
                                                        {
                                                            name: `data.features.${index}.title`,
                                                            label: t('sections.title') || 'Title',
                                                            type: 'text',
                                                            value: normalizeFieldValue(item.title || {}),
                                                            required: true,
                                                        },
                                                        {
                                                            name: `data.features.${index}.description`,
                                                            label: t('sections.description') || 'Description',
                                                            type: 'textarea',
                                                            value: normalizeFieldValue(item.description || {}),
                                                        },
                                                    ]}
                                                    errors={errors}
                                                />
                                            </div>
                                        )}
                                    />
                                </div>
                            )}
                            {/* Products Section Fields */}
                            {sectionType === 'products' && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="sectionData.source">{t('sections.source') || 'Source'}</Label>
                                        <Select
                                            onValueChange={value => setSectionData((prev: any) => ({ ...prev, source: value }))}
                                            defaultValue={section.data?.source || 'latest'}
                                        >
                                            <SelectTrigger id="sectionData.source">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="latest">Latest</SelectItem>
                                                <SelectItem value="best_seller">Best Seller</SelectItem>
                                                <SelectItem value="manual">Manual Selection</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors['data.source']} />
                                    </div>

                                    {sectionData?.source === 'manual' && (
                                        <div className="space-y-2">
                                            <Label>{t('sections.products') || 'Products'} *</Label>
                                            <MultiSelect
                                                defaultValue={section.data?.product_ids || []}
                                                options={products.map(p => ({
                                                    value: String(p.id),
                                                    label: typeof p.name === 'string' ? p.name : (p.name.en || p.name.ar || String(p.id))
                                                }))}
                                                onValueChange={(value) => setSectionData((prev: any) => ({ ...prev, product_ids: value }))}
                                            />
                                            <InputError message={errors['data.product_ids']} />
                                        </div>
                                    )}
                                </div>
                            )}
                            {/* Categories Section Fields */}
                            {sectionType === 'categories' && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="sectionData.source">{t('sections.source') || 'Source'}</Label>
                                        <Select
                                            defaultValue={section.data?.source || 'featured_only'}
                                            onValueChange={(value) => {
                                                setSectionData((prev: any) => ({ ...prev, source: value }));
                                            }}
                                        >
                                            <SelectTrigger id="sectionData.source">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="featured_only">Featured Only</SelectItem>
                                                <SelectItem value="manual">Manual Selection</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors['data.source']} />
                                    </div>

                                    {sectionData?.source === 'manual' && (
                                        <div className="space-y-2">
                                            <Label>{t('sections.categories') || 'Categories'} *</Label>
                                            <MultiSelect
                                                defaultValue={section.data?.category_ids || []}
                                                options={categories.map(c => ({
                                                    value: String(c.id),
                                                    label: typeof c.name === 'string' ? c.name : (c.name.en || c.name.ar || String(c.id))
                                                }))}
                                                onValueChange={(value) => setSectionData((prev: any) => ({ ...prev, category_ids: value }))}
                                                placeholder={t('sections.select_categories') || 'Select categories...'}
                                            />
                                            <InputError message={errors['data.category_ids']} />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Stores Section Fields */}
                            {sectionType === 'stores' && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="sectionData.source">{t('sections.source') || 'Source'}</Label>
                                        <Select
                                            defaultValue={section.data?.source || 'trendy'}
                                            onValueChange={(value) => {
                                                setSectionData((prev: any) => ({ ...prev, source: value }));
                                            }}
                                        >
                                            <SelectTrigger id="sectionData.source">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="trendy">Trendy</SelectItem>
                                                <SelectItem value="manual">Manual Selection</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors['data.source']} />
                                    </div>

                                    {sectionData?.source === 'manual' && (
                                        <div className="space-y-2">
                                            <Label>{t('sections.stores') || 'Stores'} *</Label>
                                            <MultiSelect
                                                options={stores.map(s => ({
                                                    value: String(s.id),
                                                    label: typeof s.name === 'string' ? s.name : (s.name.en || s.name.ar || String(s.id))
                                                }))}
                                                defaultValue={section.data?.store_ids || []}
                                                onValueChange={(value) => setSectionData((prev: any) => ({ ...prev, store_ids: value }))}
                                                placeholder={t('sections.select_stores') || 'Select stores...'}
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
                                                label: t('sections.title') || 'Title',
                                                type: 'text',
                                                value: normalizeFieldValue(sectionData.title || {}),
                                                required: true,
                                            },
                                            {
                                                name: 'data.description',
                                                label: t('sections.description') || 'Description',
                                                type: 'textarea',
                                                value: normalizeFieldValue(sectionData.description || {}),
                                            },
                                        ]}
                                        errors={errors}
                                    />
                                    <div className="space-y-2">
                                        <Label htmlFor="data.button_text">{t('sections.button_text') || 'Button Text'}</Label>
                                        <Input
                                            id="data.button_text"
                                            name="data[button_text]"
                                            defaultValue={sectionData.button_text || ''}
                                            onChange={(e) => {
                                                setSectionData((prev: any) => ({ ...prev, button_text: e.target.value }));
                                            }}
                                        />
                                        <InputError message={errors['data.button_text']} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="data.button_link">{t('sections.button_link') || 'Button Link'}</Label>
                                        <Input
                                            id="data.button_link"
                                            name="data[button_link]"
                                            type="url"
                                            defaultValue={sectionData.button_link || ''}
                                            onChange={(e) => {
                                                setSectionData((prev: any) => ({ ...prev, button_link: e.target.value }));
                                            }}
                                        />
                                        <InputError message={errors['data.button_link']} />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>


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
