import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { User } from '@demo/interfaces/user/user';
import { users } from '@demo/pages/datatables/constants/users.const';
import { Paginator } from 'ngx-emma/paginator';

import {
  DTColumns,
  DTHttpResponse,
  DTHttpService,
  DTOptions,
  DatatablesComponent,
} from 'ngx-emma/datatables';
import { PaginatorComponent } from 'ngx-emma/paginator';
import { map } from 'rxjs';

@Component({
  standalone: true,
  imports: [DatatablesComponent, PaginatorComponent],
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
      orderable: false,
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
    },
  ];
  optionsPaginator = computed<Paginator>(() => ({
    length: this.options().data?.length || 0,
    pageSize: this.options().pageLength || 10,
    currentPage: this.options().start || 1,
    //hidePageNumber: false,
    //disabled: true,
  }));
  options = signal<DTOptions<User>>({
    serverSide: true,
    columns: this.columns,
    //http: this.http,
    data: users,
    lengthMenu: [10, 25, 50, 100],
    pageLength: 10,
    start: 1,
    order: [[0, 'asc']],
    className: {
      table: 'table table-sm table-striped table-bordered nowrap',
    },
  });
  setPage(page: number): void {
    this.options.update((prev) => {
      return {
        ...prev,
        start: page,
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
