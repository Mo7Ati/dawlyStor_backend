import '../css/app.css';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import './i18n';
import { PanelType } from '@/types';
import { changeLanguage } from 'i18next';
import { DirectionProvider } from './components/ui/direction';
import { toast } from 'sonner';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        router.on('flash', (event) => {
            if (event.detail.flash.success) {
                toast.success(event.detail.flash.success as string)
            }
            if (event.detail.flash.error) {
                toast.error(event.detail.flash.error as string)
            }
        })

        const root = createRoot(el);
        const { currentLocale, panel } = props.initialPage?.props;

        initializeTheme(panel as PanelType);
        changeLanguage(currentLocale as string);

        root.render(
            <DirectionProvider dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}>
                <App {...props} />
            </DirectionProvider>
            // <StrictMode>
            // </StrictMode>,
        );
    },
    progress: {
        color: '#f59e0b',
    },
});
