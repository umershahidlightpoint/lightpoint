import { Route } from '@angular/router';
import { FundTheoreticalComponent } from './fund-theoretical.component';
import { PerformanceCanDeactivateGuard } from 'src/services/guards/performance-can-deactivate-guard.service';

export const FundtheoreticalRoutes: Route[] = [
    {
        path: '',
        component: FundTheoreticalComponent,
        canDeactivate: [PerformanceCanDeactivateGuard]

    }
]