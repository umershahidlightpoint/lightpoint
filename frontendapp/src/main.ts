import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import 'ag-grid-enterprise';

if (environment.production) {
  enableProdMode();
}

function loadConfig() {
  return new Promise(resolve => {
    const script = document.createElement('script');
    script.setAttribute('src', 'config.js?v' + Date.now());
    script.onload = resolve;
    document.body.appendChild(script);
  });
}

loadConfig().then(() => {
  // debugger;

  environment.remoteServerUrl = window['config'].remoteServerUrl;
  environment.referenceDataUrl = window['config'].referenceDataUrl;

  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.error(err));
});
