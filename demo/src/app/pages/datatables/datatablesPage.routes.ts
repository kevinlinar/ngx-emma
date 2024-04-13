import { Route } from '@angular/router';

export const datatablesPagesRoutes: Route = {
  path: 'datatables',
  loadComponent: () =>
    import('./datatablesPage.component').then((m) => m.DatatablesPageComponent),
  data: { module: 'datatables', preload: false },
};
