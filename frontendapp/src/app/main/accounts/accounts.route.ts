import { Route } from '@angular/router';
import { AccountComponent } from './account.component';
import { CreateAccountComponent } from './create-account/create-account.component';

export const AccountRoutes: Route[] = [
    {
        path: '',
        component: AccountComponent,
        children: [
                    {
                        path: 'create-account',
                        component: CreateAccountComponent
                    }
                ]
    },
];
