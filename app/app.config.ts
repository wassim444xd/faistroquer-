import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
// لا يوجد استيراد لـ provideAnimations أو provideToastr

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // لا يوجد provideAnimations() أو provideToastr() هنا
  ]
};