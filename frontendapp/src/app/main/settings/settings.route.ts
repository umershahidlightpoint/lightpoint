import { Route } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { LayoutsComponent } from './layouts/layouts.component';

export const SettingsRoutes: Route[] = [
    {
        path: '',
        component: SettingsComponent

    },
    {
        path: 'settings',
        component: SettingsComponent

    },
    {
        path: 'grid-views',
        component: LayoutsComponent

    }
]
