import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NotfoundComponent } from './notfound/notfound.component';

import { LpToolkitModule } from '@lightpointfinancialtechnology/lp-toolkit';

import { NotFoundRoutes } from './notfound.route';

const notFoundComponents = [NotfoundComponent];

@NgModule({
  declarations: [...notFoundComponents],
  exports: [],
  imports: [CommonModule, FormsModule, RouterModule.forChild(NotFoundRoutes), LpToolkitModule]
})
export class NotFoundModule {}
