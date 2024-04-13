import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { User } from '@demo/interfaces/user/user';

import {
  DTColumns,
  DTHttpResponse,
  DTHttpService,
  DTOptions,
  DatatablesComponent,
} from '@ngx-emma/datatables';
import { map } from 'rxjs';

@Component({
  standalone: true,
  imports: [DatatablesComponent],
  templateUrl: './datatablesPage.component.html',
  styleUrl: './datatablesPage.component.scss',
})
export class DatatablesPageComponent {
  private httpService = inject(DTHttpService);
  columns: DTColumns[] = [
    {
      title: 'ID',
      data: 'id',
    },
    {
      title: 'Nombre',
      data: 'name',
    },
    {
      title: 'Nombre de usuario',
      data: 'username',
    },
    {
      title: 'Email',
      data: 'email',
    },
    {
      title: 'latitud',
      data: 'address.geo.lat',
    },
  ];
  options = signal<DTOptions<User>>({
    serverSide: true,
    columns: this.columns,
    http: this.httpService
      .getData<User>({
        url: 'https://jsonplaceholder.typicode.com/users',
        method: 'get',
      })
      .pipe(
        map((response) => {
          const res = response as unknown as User[];
          return {
            recordsTotal: res.length,
            recordsFiltered: res.length,
            data: res,
          };
        })
      ),
    className: {
      table: 'table table-striped table-bordered',
    },
  });

  httpError(e: HttpErrorResponse): void {
    console.log(e);
  }

  getData(e: DTHttpResponse<User>): void {
    console.log(e);
  }
}
