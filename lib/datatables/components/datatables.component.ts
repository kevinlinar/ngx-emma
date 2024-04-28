import { NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  effect,
  inject,
  model,
  output,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Paginator, PaginatorComponent } from 'ngx-emma/paginator';
import { SearchComponent, SearchOptions } from 'ngx-emma/search';
import { DeepAccessPipe } from '../pipes/deep-access.pipe';
import { DTHttpService } from '../services/dt-http.service';
import {
  DTHttpResponse,
  DTOptions,
  DTOrderColumns,
  DTOrderDirection,
} from '../types';
import { PagingInfo } from '../types/dt-paging-info';
import { convertToDTDataRequestColumn } from '../utils/convert-to-dt-data-request-column';
import { convertToDTDataRequestOrder } from '../utils/convert-to-td-data-request-order';
import { isValidResponse } from '../utils/is-valid-response';
import { localSort } from '../utils/local-sort';
import { searchData } from '../utils/search-data';
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
  ],
})
export class DatatablesComponent<T> implements OnInit {
  private httpService = inject(DTHttpService);
  private destroyRef = inject(DestroyRef);
  private http = computed(() => {
    return this.options().http;
  });
  private serverSide = computed(() => this.options().serverSide && this.http());

  protected httpError = output<HttpErrorResponse>();
  protected data = output<DTHttpResponse<T>>();

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
    const pageSize = this.options().pageLength || 10;
    const currentPage = this.options().displayStart || 1;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    if (!this.serverSide()) {
      this.allData()?.slice(startIndex, endIndex);
    }
    return this.allData();
  });
  protected optionsPaginator = computed<Paginator>(() => {
    return {
      length: this.dataFiltered(),
      pageSize: this.options().pageLength || 10,
      currentPage: this.options().displayStart || 1,
      hidePageNumber: this.options().paginatorOptions?.hidePageNumber,
      disabled: this.options().paginatorOptions?.disabled,
      showFirstLastButtons:
        this.options().paginatorOptions?.showFirstLastButtons,
      hidePageSize: this.options().paginatorOptions?.hidePageSize,
      className: this.options().paginatorOptions?.className,
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
      ((this.options().displayStart || 1) - 1) *
        (this.options().pageLength || 10) +
      1;
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

  public options = model.required<DTOptions<T>>();
  constructor() {
    effect(() => {
      const options = this.options();
      untracked(() => {
        if (this.serverSide()) {
          this.setDataRequest(this.options());
        } else {
          if (options.searchOptions && options.searchOptions.search) {
            searchData(
              options.data || [],
              options.searchOptions.search,
              this.columnsSearchable(),
            );
          } else {
            this.allData.set(options.data || []);
          }
        }
      });
    });
  }

  ngOnInit(): void {
    this.getData();
    if (!this.serverSide()) {
      this.allDataLength.set(this.options().data?.length || 0);
    }
  }

  set pageLength(pageLength: string) {
    this.options.update((prev) => ({
      ...prev,
      pageLength: Number(pageLength),
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

  protected set orderColumn(columnIndex: number) {
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
        displayStart: 1,
      };
    });
  }
  private getData() {
    if (!this.serverSide()) {
      return;
    }
    const http = this.http();
    if (http) {
      http.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (response) => {
          if (isValidResponse(response)) {
            this.allData.set(response.data || []);
            this.allDataLength.set(response.recordsTotal);
            this.dataFiltered.set(response.recordsFiltered);
            this.data.emit(response);
          } else {
            console.error('The response does not have the expected format.');
          }
          this.loading.set(false);
        },
        error: (e: HttpErrorResponse) => {
          this.httpError.emit(e);
        },
      });
    }
  }
  private setDataRequest(options: DTOptions<T>): void {
    if (!this.serverSide()) {
      return;
    }
    this.loading.set(true);
    const columns = convertToDTDataRequestColumn([...options.columns], {
      value: '',
      regex: false,
    });
    const order = options.order
      ? convertToDTDataRequestOrder(options.order)
      : [{ column: 0, dir: 'asc' }];
    const start =
      ((options.displayStart || 1) - 1) * (options.pageLength || 10);
    this.httpService?.updateParams({
      start,
      length: options.pageLength || 10,
      order,
      columns,
      search: {
        value: options.searchOptions?.search || '',
        regex: false,
      },
    });
  }
}
