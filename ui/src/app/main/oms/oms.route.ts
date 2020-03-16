import { Route } from '@angular/router';
import { AccrualsComponent } from './accruals/accruals.component';
import { JournalAllocationComponent } from './journal-allocation/journal-allocation.component';
import { TradeAllocationComponent } from './trade-allocation/trade-allocation.component';
import { SecuritiesComponent } from './securities/securities.component';

export const OmsRoutes: Route[] = [
    {
        path: '',
        component: AccrualsComponent

    },
    {
        path: 'accruals',
        component: AccrualsComponent

    },
    {
        path: 'trade-allocation',
        component: TradeAllocationComponent

    },
    {
        path: 'journal-allocation',
        component: JournalAllocationComponent

    },
    {
        path: 'security',
        component: SecuritiesComponent

    },

]
