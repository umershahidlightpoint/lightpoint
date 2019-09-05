import { PrimengTableHelper } from '../helpers/PrimengTableHelper';
import { Injector } from '@angular/core';

export abstract class AppComponentBase {
  primengTableHelper: PrimengTableHelper;

  constructor(injector: Injector) {
    this.primengTableHelper = new PrimengTableHelper();
  }
}
