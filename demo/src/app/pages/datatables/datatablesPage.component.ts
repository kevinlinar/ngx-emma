import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { User } from '@demo/interfaces/user/user';
import { users } from '@demo/pages/datatables/constants/users.const';

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
  http = this.httpService
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
    );
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
      title: 'ID',
      data: 'id',
    },
    {
      title: 'Email',
      data: 'email',
    },
    {
      title: 'ciudad',
      data: 'address.city',
    },
  ];
  options = signal<DTOptions<User>>({
    serverSide: false,
    columns: this.columns,
    //http: this.http,
    data: users,
    order: [
      [0, 'asc'],
      [1, 'asc'],
    ],
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
