import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  model,
  output,
  signal,
  untracked,
} from '@angular/core';
import { Paginator, PaginatorComponent } from 'ngx-emma/paginator';
import { SearchComponent, SearchOptions } from 'ngx-emma/search';
import { catchError, debounceTime, take, throwError } from 'rxjs';
import { DTErrors } from '../constants/errors';
import { DeepAccessPipe } from '../pipes/deep-access.pipe';
import { DTHttpService } from '../services';
import {
  DTDataRequest,
  DTHttpResponse,
  DTOptions,
  DTOrderColumns,
  DTOrderDirection,
  DTLengthMenu,
} from '../types';
import { PagingInfo } from '../types/dt-paging-info';
import { convertToDTDataRequestColumn } from '../utils/convert-to-dt-data-request-column';
import { convertToDTDataRequestOrder } from '../utils/convert-to-td-data-request-order';
import { localSort } from '../utils/local-sort';
import { searchData } from '../utils/search-data';
import { LengthMenuComponent } from './length-menu/length-menu.component';
import { PagingInfoComponent } from './paging-info/paging-Info.component';
@Component({
  selector: 'ngx-emma-datatables',
  standalone: true,
  templateUrl: './datatables.component.html',
  styleUrl: './datatables.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DeepAccessPipe,
    NgClass,
    PaginatorComponent,
    SearchComponent,
    PagingInfoComponent,
    LengthMenuComponent,
  ],
})
export class DatatablesComponent<T> {
  private httpService = inject(DTHttpService);
  private http = computed(() => {
    return this.options().http;
  });
  private serverSide = computed(() => this.options().serverSide);
  private dataRequest = computed<DTDataRequest>(() => {
    const options = this.options();
    const lengthMenu = untracked(() => this.lengthMenu().length);
    const columns = convertToDTDataRequestColumn([...options.columns], {
      value: '',
      regex: false,
    });
    const order = options.order
      ? convertToDTDataRequestOrder(options.order)
      : [{ column: 0, dir: 'asc' }];
    const start = ((options.displayStart || 1) - 1) * lengthMenu;
    return {
      start,
      length: lengthMenu,
      order,
      columns,
      search: {
        value: options.searchOptions?.search || '',
        regex: false,
      },
    };
  });
  protected error = output<Error>();
  protected data = output<DTHttpResponse<T>>();
  protected lengthMenu = computed<DTLengthMenu>(() => {
    return {
      menu: this.options().lengthMenu?.menu || [10, 25, 50, 100],
      length: this.options().lengthMenu?.length || 10,
    };
  });

  protected columns = computed(() => {
    const options = this.options();
    return (
      options.order?.forEach(([columnIndex, direction]) => {
        options.columns = options.columns.map((column, index) => {
          if (index === columnIndex) {
            return { ...column, ordered: direction };
          }
          return column;
        });
      }) || options.columns
    );
  });
  protected columnsSortables = computed(() =>
    this.columns().filter((columns) => columns.orderable !== false),
  );
  protected columnsSearchable = computed(() =>
    this.columns().filter((columns) => columns.searchable !== false),
  );
  protected pagingInfo = computed<PagingInfo>(() => {
    return {
      allDataLength: this.allDataLength(),
      startIndex: this.startIndex(),
      endIndex: this.endIndex(),
      dataFiltered: this.dataFiltered(),
      filtered: !!this.options().searchOptions?.search,
    };
  });
  protected showData = computed(() => {
    const pageSize = this.lengthMenu().length;
    const currentPage = this.options().displayStart || 1;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    if (
      (!this.http() && !this.serverSide()) ||
      (this.http() && !this.serverSide() && this.dataReceived())
    ) {
      return this.allData()?.slice(startIndex, endIndex);
    }
    return this.allData();
  });
  protected optionsPaginator = computed<Paginator>(() => {
    return {
      length: this.dataFiltered(),
      pageSize: this.lengthMenu().length,
      currentPage: this.options().displayStart || 1,
      hidePageNumber: this.options().paginator?.hidePageNumber,
      disabled: this.options().paginator?.disabled,
      showFirstLastButtons: this.options().paginator?.showFirstLastButtons,
      hidePageSize: this.options().paginator?.hidePageSize,
      className: this.options().paginator?.className,
    };
  });
  protected optionsSearch = computed<SearchOptions>(() => ({
    search: this.options().searchOptions?.search || '',
    searchPlaceholder: this.options().searchOptions?.searchPlaceholder || '',
    searchDelay: this.options().searchOptions?.searchDelay || 300,
    minlength: this.options()?.searchOptions?.minlength || 1,
    maxLength: this.options()?.searchOptions?.maxLength || 255,
  }));
  protected startIndex = computed(() => {
    const showing =
      ((this.options().displayStart || 1) - 1) * this.lengthMenu().length + 1;
    return showing > this.dataFiltered() ? this.dataFiltered() : showing;
  });
  protected endIndex = computed(() => {
    const showing = this.startIndex() + this.optionsPaginator().pageSize - 1;
    return showing > this.dataFiltered() ? this.dataFiltered() : showing;
  });
  protected dataFiltered = signal(0);
  protected allData = signal<T[]>([]);
  protected loading = signal(false);
  protected allDataLength = signal(this.allData().length);
  protected dataReceived = signal(false);

  public options = model.required<DTOptions<T>>();

  constructor() {
    effect(() => {
      const options = this.options();
      untracked(() => {
        if (this.http() && !this.serverSide()) {
          if (!this.dataReceived()) {
            this.getData();
            return;
          }
        } else if (this.http() && this.serverSide()) {
          this.getData();
          return;
        }
        if (options.searchOptions && options.searchOptions.search) {
          const recordsFiltered = searchData(
            options.data || [],
            options.searchOptions.search,
            this.columnsSearchable(),
          );
          this.allData.set(recordsFiltered || []);
          this.dataFiltered.set(recordsFiltered.length);
          this.allDataLength.set(options.data?.length || 0);
        } else {
          this.allData.set(options.data || []);
          this.dataFiltered.set(this.allData().length);
          this.allDataLength.set(this.allData().length);
        }
      });
    });
  }

  private getData() {
    const http = this.http();
    if (!http) {
      return;
    }
    this.loading.set(true);
    this.httpService
      .getData<T>(http, this.dataRequest())
      .pipe(
        debounceTime(100),
        take(1),
        catchError((error) => {
          return throwError(() => error);
        }),
      )
      .subscribe({
        next: (response) => {
          if (!Array.isArray(response.data)) {
            console.error(DTErrors.EXPECTED_FORMAT);
            this.error.emit(new Error(DTErrors.EXPECTED_FORMAT));
            return;
          }
          this.dataReceived.set(true);
          this.allData.set(response.data || []);
          this.allDataLength.set(response.recordsTotal || response.data.length);
          this.dataFiltered.set(
            response.recordsFiltered || response.data.length,
          );
          if (!this.serverSide()) {
            this.options.update((prev) => ({
              ...prev,
              data: response.data,
            }));
          }
          this.data.emit(response);
          this.loading.set(false);
        },
        error: (error) => {
          this.dataReceived.set(false);
          this.loading.set(false);
          console.error(DTErrors.HTTP_ERROR, '\n', error);
          this.error.emit(error);
        },
      });
  }

  set orderColumn(columnIndex: number) {
    const column = this.columns().find((_, index) => index === columnIndex);
    if (!column || column?.orderable === false) {
      return;
    }
    let newDirection: DTOrderDirection = 'asc';
    if (column?.ordered === 'asc') {
      newDirection = 'desc';
    }
    const columns = [
      ...this.columns().map((column, index) => {
        return {
          ...column,
          ordered: index === columnIndex ? newDirection : undefined,
        };
      }),
    ];
    const order: DTOrderColumns = [[columnIndex, newDirection]];
    const options: DTOptions<T> = {
      ...this.options(),
      columns,
      order,
      displayStart: 1,
    };
    if (!this.serverSide()) {
      options.data = localSort<T>(
        this.columnsSortables(),
        order,
        this.options().data || [],
      );
    }
    this.options.update((prev) => {
      return {
        ...prev,
        columns,
        order,
        data: options.data,
        displayStart: 1,
      };
    });
  }

  set pageLength(pageLength: number) {
    this.options.update((prev) => ({
      ...prev,
      lengthMenu: {
        menu: this.options().lengthMenu?.menu || [10, 25, 50, 100],
        length: pageLength,
      },
      displayStart: 1,
    }));
  }

  set search(search: string) {
    this.options.update((prev) => ({
      ...prev,
      searchOptions: {
        ...prev.searchOptions,
        search,
      },
      displayStart: 1,
    }));
  }
  set page(page: number) {
    this.options.update((prev) => ({
      ...prev,
      displayStart: page,
    }));
  }
}
