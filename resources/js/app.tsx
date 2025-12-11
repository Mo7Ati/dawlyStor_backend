import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import './i18n';
import { PanelType } from '@/types';
import { changeLanguage } from 'i18next';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        const { currentLocale, panel } = props.initialPage?.props ?? {};

        initializeTheme(panel as PanelType);
        changeLanguage(currentLocale as string);
        document.documentElement.setAttribute('dir', currentLocale === 'ar' ? 'rtl' : 'ltr');

        root.render(
                <App {...props} />
            // <StrictMode>
            // </StrictMode>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});
