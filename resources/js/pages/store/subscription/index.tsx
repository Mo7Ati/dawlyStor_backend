import { router, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    CheckIcon,
    CreditCard,
    X,
    Loader2,
    Calendar,
    Sparkles,
    Clock,
    TrendingUp,
    CheckCircle2,
    AlertCircle,
    CheckCircle,
    Settings,
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import subscription from '@/routes/store/subscription';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface Plan {
    id: string;
    name: string;
    price: number;
    interval: string;
    stripe_price_id: string | null;
    features: string[];
}

interface Store {
    has_subscription: boolean;
    on_trial: boolean;
    trial_ends_at: string | null;
    remaining_trial_days: number;
    subscription: {
        name: string;
        stripe_status: string;
        ends_at: string | null;
    } | null;
}

interface SubscriptionIndexProps {
    store: Store;
    plans: Plan[];
}

export default function SubscriptionIndex({ store, plans }: SubscriptionIndexProps) {
    const { t } = useTranslation('subscription');
    const { post, processing } = useForm();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            href: '/store/subscription',
            title: t('page_title'),
        },
    ];

    const handleCheckout = async (planId: string) => {
        router.post(subscription.checkout.url(), {
            plan: planId,
        });
    };

    const handleCancel = () => {
        if (confirm(t('cancel_confirmation'))) {
            post(subscription.cancel.url(), {
                onSuccess: () => {
                    toast.success(t('subscription_canceled'));
                    router.reload();
                },
                onError: (errors) => {
                    toast.error(errors.error || t('cancel_error'));
                },
            });
        }
    };

    const handleResume = () => {
        post(subscription.resume.url(), {
            onSuccess: () => {
                toast.success(t('subscription_resumed'));
                router.reload();
            },
            onError: (errors) => {
                toast.error(errors.error || t('resume_error'));
            },
        });
    };

    const handleBilling = () => {
        router.visit(subscription.billing.url());
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'active':
            case 'trialing':
                return 'default';
            case 'canceled':
                return 'secondary';
            case 'past_due':
            case 'unpaid':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const getStatusLabel = (status: string) => {
        const statusMap: Record<string, string> = {
            'active': 'Active',
            'trialing': 'Trialing',
            'canceled': 'Canceled',
            'past_due': 'Past Due',
            'unpaid': 'Unpaid',
            'incomplete': 'Incomplete',
            'incomplete_expired': 'Expired',
        };
        return statusMap[status] || status;
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} title={t('page_title')}>
            <div className="flex h-full flex-1 flex-col overflow-x-auto">
                <div className="container mx-auto px-4 py-8  space-y-8">
                    {/* Pricing Plans */}
                    <div className="mx-auto max-w-5xl">
                        <div className="mb-8 text-center">
                            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                {store.has_subscription ? 'Available Plans' : 'Choose Your Plan'}
                            </h2>
                            <p className="mt-2 text-muted-foreground">
                                Select the plan that works best for you
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            {plans.map((plan) => {
                                const isCurrentPlan = store.has_subscription &&
                                    store.subscription?.stripe_status !== 'canceled' &&
                                    plan.id === (store.subscription?.name?.toLowerCase().includes('monthly') ? 'monthly' : 'yearly');

                                const isYearly = plan.id === 'yearly';
                                const monthlyPrice = plans.find(p => p.id === 'monthly')?.price || 0;
                                const yearlySavings = isYearly && monthlyPrice > 0
                                    ? Math.round(((monthlyPrice * 12 - plan.price) / (monthlyPrice * 12)) * 100)
                                    : 0;

                                return (
                                    <Card
                                        key={plan.id}
                                        className={`relative flex flex-col transition-all ${isYearly
                                            ? 'border-primary shadow-lg md:scale-105'
                                            : 'border'
                                            } ${isCurrentPlan ? 'ring-2 ring-primary' : ''}`}
                                    >
                                        {isYearly && (
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                                <Badge className="px-3 py-1">
                                                    <Sparkles className="mr-1 h-3 w-3" />
                                                    {t('best_value')}
                                                </Badge>
                                            </div>
                                        )}
                                        {isCurrentPlan && (
                                            <div className="absolute -top-4 right-4">
                                                <Badge variant="secondary" className="px-3 py-1">
                                                    Current
                                                </Badge>
                                            </div>
                                        )}

                                        <CardHeader className="pb-8">
                                            <CardTitle className="text-2xl font-semibold">
                                                {plan.name}
                                            </CardTitle>
                                            <div className="mt-4">
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-5xl font-bold tracking-tight">
                                                        ${plan.price}
                                                    </span>
                                                    <span className="text-lg text-muted-foreground">
                                                        /{plan.interval}
                                                    </span>
                                                </div>
                                                {isYearly && yearlySavings > 0 && (
                                                    <p className="mt-2 text-sm text-primary">
                                                        Save {yearlySavings}% annually
                                                    </p>
                                                )}
                                            </div>
                                        </CardHeader>

                                        <CardContent className="flex flex-1 flex-col gap-6">
                                            <ul className="space-y-3">
                                                {plan.features.map((feature, index) => (
                                                    <>
                                                        <li key={index} className="flex items-start gap-3">
                                                            <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                                                            <span className="text-sm text-muted-foreground">
                                                                {feature}
                                                            </span>
                                                        </li>
                                                    </>
                                                ))}
                                            </ul>
                                            {
                                                isCurrentPlan && (
                                                    <Link href={subscription.billing.url()} className="w-full flex items-center gap-2">
                                                        <Settings className="mr-2 h-4 w-4" />
                                                        manage billing
                                                    </Link>
                                                )
                                            }

                                            <div className="mt-auto pt-4">
                                                <Button
                                                    className="w-full"
                                                    onClick={() => handleCheckout(plan.id)}
                                                    variant={isYearly ? 'default' : 'outline'}
                                                    disabled={isCurrentPlan || processing}
                                                    size="lg"
                                                >
                                                    {processing ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            Processing...
                                                        </>
                                                    ) : isCurrentPlan ? (
                                                        <>
                                                            <CheckIcon className="mr-2 h-4 w-4" />
                                                            {t('current_plan')}
                                                        </>
                                                    ) : (
                                                        t('subscribe')
                                                    )}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
