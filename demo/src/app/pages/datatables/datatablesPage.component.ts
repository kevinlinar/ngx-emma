import { Component, OnInit, signal } from '@angular/core';
import { User } from '@demo/interfaces/user/user';
import { users } from '@demo/pages/datatables/constants/users.const';

import {
  DTColumns,
  DTHttp,
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
  users = users;
  http: DTHttp<User> = {
    url: 'http://localhost:3000/users',
  };
  http2: DTHttp<User> = {
    url: 'http://localhost:3000/users/1',
    method: 'get',
    pipeResponse: (response) => {
      return {
        recordsTotal: response.length,
        recordsFiltered: response.length,
        data: response,
      };
    },
  };
  http3: DTHttp<User> = {
    url: 'http://localhost:3000/users/2',
    pipeResponse: (response) => {
      return {
        data: response,
      };
    },
  };
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
    serverSide: false,

    columns: this.columns,
    http: this.http3,
    data: users,
    lengthMenu: [10, 25, 50, 100],
    pageLength: 10,
    displayStart: 1,
    order: [[0, 'asc']],
    searchOptions: {
      search: '',
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
    /* this.options.update((prev) => {
      return {
        ...prev,
        http: {
          url: `http://localhost:3000/users/2/`,
        },
      };
    }); */
  }

  DTError(e: Error): void {
    console.error(e);
  }

  getData(e: unknown): void {
    //console.log(e);
  }
}
