import { ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withPreloading,
  withViewTransitions,
} from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { PreloadStrategy } from './services/preload-strategy/preload-strategy.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withPreloading(PreloadStrategy),
      withViewTransitions()
    ),
    provideHttpClient(),
  ],
};
