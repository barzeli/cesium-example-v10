import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Ion } from 'cesium';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

window['CESIUM_BASE_URL'] = '/assets/cesium/';
Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyNjE3MDMzOS0xZmVlLTRhYzYtOGU5ZS05NDk3YTlkYzM3ZDciLCJpZCI6MTA4MjU5LCJpYXQiOjE2NjMzMzQ4NTJ9.fLqi-liWgg4jKIgIxPFo2L6e1KwAjBDOQXl78BI4Res';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
