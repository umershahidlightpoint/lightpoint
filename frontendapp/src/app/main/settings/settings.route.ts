import { Route } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';

export const SettingsRoutes: Route[] = [
  {
    path: '',
    component: SettingsComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  }
];
