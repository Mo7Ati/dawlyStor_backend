import { Form, router } from '@inertiajs/react'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Addition, Category, Option, Product, ProductAddition, ProductOption } from '@/types/dashboard'
import FormButtons from '@/components/form/form-buttons'
import { normalizeFieldValue } from '@/lib/utils'
import TranslatableTabs from '@/components/form/translatable-tabs'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import InputError from '@/components/input-error'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import IsActive from '@/components/form/is-active'
import FileUpload from '@/components/form/file-upload'
import products from '@/routes/store/products'
import IsActiveFormField from '@/components/form/is-active'
import { Repeater } from '@/components/repeater'
// import { Repeater } from '@/components/repeater'

interface ProductFormProps {
    product: Product
    categories: Category[]
    additionsData: Addition[]
    optionsData: Option[]
    type: 'create' | 'edit'
}

export default function ProductForm({ product, categories, additionsData = [], optionsData = [], type }: ProductFormProps) {
    const { t } = useTranslation('forms');

    const [additions, setAdditions] = useState<ProductAddition[]>(product.additions ?? []);
    const [options, setOptions] = useState<ProductOption[]>(product.options ?? []);


    return (
        <Form
            method={type === 'edit' ? 'put' : 'post'}
            action={
                (type === 'edit' && product.id)
                    ? products.update.url({ product: Number(product.id) })
                    : products.store.url()
            }
            transform={data => ({
                ...data,
                additions,
                options,
            })}
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
                                        label: t('products.name'),
                                        type: 'text',
                                        value: normalizeFieldValue(product.name),
                                        placeholder: t('products.enter_name'),
                                    },
                                    {
                                        name: 'description',
                                        label: t('products.description'),
                                        type: 'textarea',
                                        value: normalizeFieldValue(product.description),
                                    },
                                ]}
                                errors={errors}
                            />

                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('products.keywords')}</CardTitle>
                                    <CardDescription>
                                        {t('products.keywords_desc')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div>
                                        <Label htmlFor="keywords">{t('products.keywords')}</Label>
                                        <Input
                                            id="keywords"
                                            name="keywords"
                                            type="text"
                                            defaultValue={Array.isArray(product.keywords) ? product.keywords.join(', ') : ''}
                                            placeholder={t('products.enter_keywords')}
                                            aria-invalid={errors.keywords ? 'true' : 'false'}
                                        />
                                        <span className="text-muted-foreground text-xs">
                                            {t('products.keywords_hint')}
                                        </span>
                                        <InputError message={errors.keywords} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('products.product_images')}</CardTitle>
                                    <CardDescription>
                                        {t('products.product_images_desc')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FileUpload
                                        name="temp_ids"
                                        label={t('products.images')}
                                        multiple={true}
                                        acceptedFileTypes={['image/*']}
                                        maxFiles={10}
                                        maxFileSize="5MB"
                                        error={errors.temp_ids}
                                        files={product.images ? product.images.map((image: any) => ({
                                            source: String(image.id) + '/' + image.file_name,
                                            options: {
                                                type: 'local',
                                            },
                                        })) : []}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right column – pricing & settings */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('products.pricing')}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="price">{t('products.price')}</Label>
                                        <Input
                                            id="price"
                                            name="price"
                                            type="number"
                                            step="0.01"
                                            required
                                            defaultValue={product.price}
                                            placeholder={t('products.enter_price')}
                                            aria-invalid={errors.price ? 'true' : 'false'}
                                        />
                                        <InputError message={errors.price} />
                                    </div>

                                    <div>
                                        <Label htmlFor="compare_price">{t('products.compare_price')}</Label>
                                        <Input
                                            id="compare_price"
                                            name="compare_price"
                                            type="number"
                                            step="0.01"
                                            defaultValue={product.compare_price || ''}
                                            placeholder={t('products.enter_compare_price')}
                                            aria-invalid={errors.compare_price ? 'true' : 'false'}
                                        />
                                        <span className="text-muted-foreground text-xs">
                                            {t('products.compare_price_desc')}
                                        </span>
                                        <InputError message={errors.compare_price} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('products.product_category')}</CardTitle>
                                    <CardDescription>
                                        {t('products.select_category')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div>
                                        <Label htmlFor="category_id">{t('products.category')}</Label>
                                        <Select
                                            defaultValue={String(product.category_id)}
                                            name="category_id"
                                        >
                                            <SelectTrigger id="category_id" aria-invalid={errors.category_id ? 'true' : 'false'}>
                                                <SelectValue placeholder={t('products.select_category')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="null">{t('products.no_category')}</SelectItem>
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
                                <CardHeader>
                                    <CardTitle>{t('products.product_settings')}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="quantity">{t('products.quantity')}</Label>
                                        <Input
                                            id="quantity"
                                            name="quantity"
                                            type="number"
                                            min="0"
                                            defaultValue={product.quantity || 0}
                                            placeholder={t('products.enter_quantity')}
                                            aria-invalid={errors.quantity ? 'true' : 'false'}
                                        />
                                        <InputError message={errors.quantity} />
                                    </div>

                                    <IsActiveFormField value={product.is_active} />
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className='flex gap-4 mt-4 items-start'>
                        <Card className='w-1/2 h-auto'>
                            <CardHeader>
                                <CardTitle>{t('products.additions')}</CardTitle>
                                <CardDescription>
                                    {t('products.additions_desc')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className='min-h-fit'>
                                <Repeater
                                    name="additions[]"
                                    value={additions}
                                    onChange={(e) => setAdditions(e.target.value)}
                                    createItem={() => ({
                                        addition_id: "",
                                        price: 0,
                                    })}
                                    renderRow={(item, index, update) => (
                                        <div className="grid grid-cols-2 gap-4">
                                            <Select
                                                value={String(item.addition_id)}
                                                onValueChange={(v) =>
                                                    update({ addition_id: v })
                                                }
                                                required
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t('products.select_addition')} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {additionsData
                                                        .filter(
                                                            addition => {
                                                                // Check if this addition is selected in any OTHER row (not current row)
                                                                const isSelectedInOtherRow = additions.some(
                                                                    (productAddition, idx) =>
                                                                        idx !== index &&
                                                                        productAddition.addition_id &&
                                                                        String(productAddition.addition_id) === String(addition.id)
                                                                )
                                                                // Include if not selected in other rows
                                                                return !isSelectedInOtherRow
                                                            }
                                                        )
                                                        .map(addition => (
                                                            <SelectItem key={addition.id} value={String(addition.id)}>
                                                                {addition.name as string}
                                                            </SelectItem>
                                                        ))
                                                    }
                                                </SelectContent>
                                            </Select>
                                            <Input
                                                required
                                                type="number"
                                                value={item.price}
                                                onChange={(e) =>
                                                    update({ price: Number(e.target.value) })
                                                }
                                            />
                                        </div>
                                    )}
                                />
                            </CardContent>
                        </Card>


                        {/* Options */}
                        <Card className='w-1/2 h-auto'>
                            <CardHeader>
                                <CardTitle>{t('products.options')}</CardTitle>
                                <CardDescription>
                                    {t('products.options_desc')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className='min-h-fit'>
                                <Repeater
                                    name="options[]"
                                    value={options}
                                    onChange={(e) => setOptions(e.target.value)}
                                    createItem={() => ({
                                        option_id: "",
                                        price: 0,
                                    })}
                                    renderRow={(item, index, update) => (
                                        <div className="grid grid-cols-2 gap-4">
                                            <Select
                                                value={String(item.option_id)}
                                                onValueChange={(v) =>
                                                    update({ option_id: v })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t('products.select_option')} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {optionsData
                                                        .filter(
                                                            option => {
                                                                // Check if this addition is selected in any OTHER row (not current row)
                                                                const isSelectedInOtherRow = options.some(
                                                                    (productOption, idx) =>
                                                                        idx !== index &&
                                                                        productOption.option_id &&
                                                                        String(productOption.option_id) === String(option.id)
                                                                )
                                                                // Include if not selected in other rows
                                                                return !isSelectedInOtherRow
                                                            }
                                                        )
                                                        .map(option => (
                                                            <SelectItem key={option.id} value={String(option.id)}>
                                                                {option.name as string}
                                                            </SelectItem>
                                                        ))
                                                    }
                                                </SelectContent>
                                            </Select>
                                            <Input
                                                type="number"
                                                value={item.price}
                                                onChange={(e) =>
                                                    update({ price: Number(e.target.value) })
                                                }
                                            />
                                        </div>
                                    )}
                                />
                            </CardContent>
                        </Card>

                    </div>

                    {/* <input type="hidden" name="additions[]" value={JSON.stringify(additions)} /> */}

                    <FormButtons
                        processing={processing}
                        handleCancel={() => router.visit(products.index.url())}
                        isEditMode={type === 'edit'}
                    />
                </>
            )}
        </Form>
    )
}

