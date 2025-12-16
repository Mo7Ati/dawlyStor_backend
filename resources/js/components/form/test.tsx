import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Locale {
    code: string;
    label: string;
}

interface Field {
    name: string;
    label: string;
    type?: 'text' | 'textarea' | 'email' | 'number';
    required?: boolean;
    placeholder?: Record<string, string>;
}

interface LocalizedData {
    [fieldName: string]: {
        [localeCode: string]: string;
    };
}

interface LocalizedInputCardProps {
    fields: Field[];
    locales?: Locale[];
    onSubmit?: (data: LocalizedData) => void;
    initialData?: LocalizedData;
}

export const LocalizedInputCard: React.FC<LocalizedInputCardProps> = ({
    fields,
    locales = [
        { code: 'en', label: 'English' },
        { code: 'ar', label: 'العربية' }
    ],
    onSubmit,
    initialData = {}
}) => {
    const [activeLocale, setActiveLocale] = useState<string>(locales[0]?.code || 'en');

    // Initialize form data without useEffect to avoid re-initialization
    const getInitialFormData = (): LocalizedData => {
        const data: LocalizedData = {};
        fields.forEach(field => {
            data[field.name] = {};
            locales.forEach(locale => {
                data[field.name][locale.code] = initialData[field.name]?.[locale.code] || '';
            });
        });
        return data;
    };

    const [formData, setFormData] = useState<LocalizedData>(getInitialFormData());

    const handleInputChange = (fieldName: string, locale: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: {
                ...prev[fieldName],
                [locale]: value
            }
        }));
    };

    const handleSubmit = () => {
        console.log('Form Data:', formData);
        if (onSubmit) {
            onSubmit(formData);
        } else {
            alert('Check console for form data');
        }
    };

    const renderField = (field: Field) => {
        const value = formData[field.name]?.[activeLocale] || '';
        const commonProps = {
            id: `${field.name}-${activeLocale}`,
            required: field.required,
            value: value,
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                handleInputChange(field.name, activeLocale, e.target.value),
            placeholder: field.placeholder?.[activeLocale] ||
                `Enter ${field.label} in ${activeLocale === 'ar' ? 'Arabic' : 'English'}`,
            dir: activeLocale === 'ar' ? 'rtl' as const : 'ltr' as const,
            className: 'mt-2'
        };

        return (
            <div key={field.name}>
                <Label htmlFor={commonProps.id} className="text-sm font-medium">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {field.type === 'textarea' ? (
                    <Textarea
                        {...commonProps}
                        className={`${commonProps.className} min-h-[100px]`}
                    />
                ) : (
                    <Input
                        {...commonProps}
                        type={field.type || 'text'}
                    />
                )}
            </div>
        );
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6">
            <Card>
                <CardContent className="pt-6">
                    {/* Language Tabs */}
                    <div className="flex gap-4 mb-6 border-b">
                        {locales.map(locale => (
                            <button
                                key={locale.code}
                                type="button"
                                onClick={() => setActiveLocale(locale.code)}
                                className={`pb-3 px-4 font-medium transition-colors ${activeLocale === locale.code
                                    ? 'text-orange-500 border-b-2 border-orange-500'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {locale.label}
                            </button>
                        ))}
                    </div>

                    {/* Dynamic Input Fields */}
                    <div className="space-y-6">
                        {fields.map(field => renderField(field))}

                        {/* Validation Indicators */}
                        {fields.length > 0 && (
                            <div className="space-y-2 pt-4 border-t">
                                <div className="text-sm font-medium text-gray-700 mb-2">Completion Status:</div>
                                {fields.map(field => (
                                    <div key={field.name} className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">{field.label}</span>
                                        <div className="flex gap-3">
                                            {locales.map(locale => (
                                                <div key={locale.code} className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${formData[field.name]?.[locale.code]?.trim()
                                                        ? 'bg-green-500'
                                                        : 'bg-gray-300'
                                                        }`} />
                                                    <span className="text-xs text-gray-600">{locale.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6 pt-6 border-t">
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Save
                        </button>
                    </div>
                </CardContent>
            </Card>

            {/* Preview of all data */}
            <Card className="mt-6">
                <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4">Current Data (for debugging)</h3>
                    <pre className="bg-gray-50 p-4 rounded text-sm overflow-auto">
                        {JSON.stringify(formData, null, 2)}
                    </pre>
                </CardContent>
            </Card>
        </div>
    );
};
