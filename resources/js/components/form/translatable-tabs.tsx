import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { Field, LocalizedData } from '@/types/dashboard';
import InputError from '../input-error';
import { Textarea } from '../ui/textarea';
import { cn } from '@/lib/utils';

type Locale = {
    code: 'en' | 'ar';
    label: string;
};
const locales: Locale[] = [{ code: "en", label: "English" }, { code: "ar", label: "Arabic" }];
const TranslatableTabs = ({ fields, errors }: { fields: Field[], errors: Record<string, string> }) => {
    const [activeTab, setActiveTab] = useState<Locale>(locales[0]);
    const [values, setValues] = useState<LocalizedData>({});

    useEffect(() => {
        if (errors && Object.keys(errors).length > 0) {
            const errorLocale = locales.find(locale =>
                Object.keys(errors).some(key => key.includes(`.${locale.code}`))
            );

            if (errorLocale && errorLocale.code !== activeTab.code) {
                setActiveTab(errorLocale);
            }
        }
    }, [errors]);

    return (
        <Card>
            <Tabs value={activeTab.code} onValueChange={(v) => setActiveTab(locales.find(l => l.code === v)!)}>
                <CardHeader >
                    <div>
                        <TabsList>
                            {locales.map(locale => (
                                <TabsTrigger
                                    key={locale.code}
                                    value={locale.code}
                                    className={cn(
                                        Object.keys(errors).some(key => key.includes(`.${locale.code}`)) && "text-destructive"
                                    )}
                                >
                                    {locale.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>
                </CardHeader>

                <CardContent className="pt-6">
                    {locales.map((locale) => (
                        <div
                            key={locale.code}
                            className={cn(activeTab.code === locale.code ? "block" : "hidden", "space-y-4")}
                        >
                            {fields.map(field => {
                                const errorKey = `${field.name}.${locale.code}`;
                                const errorMessage = errors[errorKey];

                                return (
                                    <div key={field.name} className="space-y-2">
                                        <Label htmlFor={`${field.name}-${locale.code}`}>
                                            {field.label}
                                            {field.required && <span className="text-destructive ms-1">*</span>}
                                        </Label>

                                        {field.type === 'text' ? (
                                            <Input
                                                id={`${field.name}-${locale.code}`}
                                                name={`${field.name}[${locale.code}]`}
                                                className={cn(errorMessage && "border-destructive")}
                                                defaultValue={field.value[locale.code] || ''}
                                                onChange={(e) => setValues({ ...values, [field.name]: { ...field.value, [locale.code]: e.target.value } })}
                                                {...field.attributes}
                                            />
                                        ) : (
                                            <Textarea
                                                id={`${field.name}-${locale.code}`}
                                                name={`${field.name}[${locale.code}]`}
                                                className={cn(errorMessage && "border-destructive")}
                                                defaultValue={field.value[locale.code] || ''}
                                                onChange={(e) => setValues({ ...values, [field.name]: { ...field.value, [locale.code]: e.target.value } })}
                                                {...field.attributes}
                                            />
                                        )}
                                        {errorMessage && <InputError message={errorMessage} />}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </CardContent>
            </Tabs>
        </Card>
    );
};

export default TranslatableTabs;


// const TranslatableTabs = ({ fields, errors }: { fields: Field[], errors: Record<string, string> }) => {
//     const [activeTab, setActiveTab] = useState<Locale>(locales[0]);
//     const [values, setValues] = useState<LocalizedData>({});

//     useEffect(() => {
//         if (errors && Object.keys(errors).length > 0) {
//             const errorLocale = locales.find(locale =>
//                 Object.keys(errors).some(key => key.includes(`.${locale.code}`))
//             );

//             if (errorLocale && errorLocale.code !== activeTab.code) {
//                 setActiveTab(errorLocale);
//             }
//         }
//     }, [errors]);

//     return (
//         <Tabs value={activeTab.code} className="w-full">
//             <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
//                     <div>
//                         <CardTitle>Store Information</CardTitle>
//                         <CardDescription>Manage content in different languages.</CardDescription>
//                     </div>

//                     {/* Tabs moved inside the CardHeader */}
//                     <TabsList className="grid w-[200px] grid-cols-2">
//                         {locales.map(locale => {
//                             const hasError = Object.keys(errors).some(key => key.includes(`.${locale.code}`));
//                             return (
//                                 <TabsTrigger
//                                     key={locale.code}
//                                     value={locale.code}
//                                     onClick={() => setActiveTab(locale)}
//                                     className={cn(hasError ? "text-destructive border-b-2 border-destructive" : "")}
//                                 >
//                                     {locale.label}
//                                 </TabsTrigger>
//                             );
//                         })}
//                     </TabsList>
//                 </CardHeader>

//                 <CardContent>
//                     {locales.map((locale) => (
//                         <div
//                             key={locale.code}
//                             className={cn(
//                                 activeTab.code === locale.code ? "block" : "hidden",
//                                 "space-y-4"
//                             )}
//                         >
//                             {fields.map(field => {
//                                 const errorKey = `${field.name}.${locale.code}`;
//                                 const errorMessage = errors[errorKey];

//                                 return (
//                                     <div key={field.name} className="space-y-2">
//                                         <Label
//                                             htmlFor={`${field.name}-${locale.code}`}
//                                             className={errorMessage ? "text-destructive" : ""}
//                                         >
//                                             {field.label}
//                                         </Label>

//                                         {field.type === 'text' ? (
//                                             <Input
//                                                 id={`${field.name}-${locale.code}`}
//                                                 name={`${field.name}[${locale.code}]`}
//                                                 className={errorMessage ? "border-destructive ring-destructive" : ""}
//                                                 defaultValue={field.value[locale.code] || ''}
//                                                 onChange={(e) =>
//                                                     setValues({
//                                                         ...values,
//                                                         [field.name]: { ...field.value, [locale.code]: e.target.value }
//                                                     })
//                                                 }
//                                                 {...field.attributes}
//                                             />
//                                         ) : (
//                                             <Textarea
//                                                 id={`${field.name}-${locale.code}`}
//                                                 name={`${field.name}[${locale.code}]`}
//                                                 className={errorMessage ? "border-destructive ring-destructive" : ""}
//                                                 defaultValue={field.value[locale.code] || ''}
//                                                 onChange={(e) =>
//                                                     setValues({
//                                                         ...values,
//                                                         [field.name]: { ...field.value, [locale.code]: e.target.value }
//                                                     })
//                                                 }
//                                                 {...field.attributes}
//                                             />
//                                         )}
//                                         {errorMessage && <InputError message={errorMessage} />}
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     ))}
//                 </CardContent>
//             </Card>
//         </Tabs>
//     );
// };
