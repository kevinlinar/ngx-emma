import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { User } from '@demo/interfaces/user/user';

import {
  DTColumns,
  DTHttpResponse,
  DTHttpService,
  DTOptions,
  DatatablesComponent,
} from 'ngx-emma/datatables';

@Component({
  standalone: true,
  imports: [DatatablesComponent],
  templateUrl: './datatablesPage.component.html',
  styleUrl: './datatablesPage.component.scss',
})
export class DatatablesPageComponent implements OnInit {
  private httpService = inject(DTHttpService);
  http = this.httpService.getData<User>({
    url: 'http://localhost:3000/users/',
    method: 'post',
  });
  /* .pipe(
      map((response) => {
        const res = response as unknown as User[];
        return {
          recordsTotal: res.length,
          recordsFiltered: res.length,
          data: res,
        };
      }),
    ); */
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
      title: 'Ciudad',
      data: 'address.city',
    },
    {
      title: 'Teléfono',
      data: 'phone',
    },
    {
      title: 'Website',
      data: 'website',
    },
    {
      title: 'Empresa',
      data: 'company.name',
      visible: false,
    },
  ];

  options = signal<DTOptions<User>>({
    serverSide: true,
    columns: this.columns,
    http: this.http,
    //data: users,
    lengthMenu: [10, 25, 50, 100],
    pageLength: 10,
    displayStart: 1,
    order: [[0, 'asc']],
    searchOptions: {
      search: '@gmail.com',
      searchPlaceholder: 'Buscar...',
      searchDelay: 300,
      minlength: 3,
      maxLength: 254,
    },
    className: {
      table: 'table table-sm table-striped table-bordered nowrap',
    },
  });

  ngOnInit(): void {
    setTimeout(() => {
      this.update();
    }, 3000);
  }

  update(): void {
    this.options.update((prev) => {
      return {
        ...prev,
        /* columns: this.columns.map((column) => {
          const visible =
            column.data === 'company.name' ? true : column.visible;
          return {
            ...column,
            visible: visible,
          };
        }), */

        http: this.httpService.getData<User>({
          url: 'http://localhost:3000/users2/',
          method: 'post',
        }),
      };
    });
  }

  httpError(e: HttpErrorResponse): void {
    console.log(e);
  }

  getData(e: DTHttpResponse<User>): void {
    console.log(e);
  }
}
