import {
  HttpClient,
  HttpClientModule,
  HttpErrorResponse,
} from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
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
import { DTLangEs } from '../constants';
import { DeepAccessPipe } from '../pipes/deep-access.pipe';
import { DTHttpService } from '../services/dt-http.service';
import {
  DTDataRequestSearch,
  DTHttpResponse,
  DTOptions,
  DTOrderDirection,
} from '../types';
import { convertToDTDataRequestColumn } from '../utils/convert-to-dt-data-request-column';
import { convertToDTDataRequestOrder } from '../utils/convert-to-td-data-request-order';
import { localSort } from '../utils/local-sort';
import { searchData } from '../utils/search-data';
import { NgClass } from '@angular/common';
@Component({
  selector: 'ngx-emma-datatables',
  standalone: true,
  templateUrl: './datatables.component.html',
  styleUrl: './datatables.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DeepAccessPipe, NgClass],
})
export class DatatablesComponent<T> implements OnInit {
  private httpService = inject(DTHttpService);
  private http = computed(() => this.options().http);
  private serverSide = computed(() => this.options().serverSide);
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
    this.columns().filter((columns) => columns.orderable !== false)
  );
  protected columnsSearchable = computed(() =>
    this.columns().filter((columns) => columns.searchable !== false)
  );
  protected allData = signal<T[]>([]);
  protected showData = computed(() => {
    const pageSize = this.options().pageLength || 10;
    const currentPage = this.options().start || 1;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return this.allData().slice(startIndex, endIndex);
  });

  options = model<DTOptions<T>>({
    columns: [],
    data: [],
    http: undefined,
    serverSide: false,
    language: DTLangEs,
    autoWidth: true,
    lengthChange: true,
    paging: true,
    scrollX: true,
    scrollY: '',
    start: 1,
    lengthMenu: [10, 25, 50],
    pageLength: 10,
    search: '',
    searchPlaceholder: '',
    searchDelay: 300,
    fixedColumns: {
      left: undefined,
      right: undefined,
    },
  });

  constructor() {
    effect(() => {
      const options = this.options();
      untracked(() => {
        this.allData.set(options.data || []);
      });
    });
  }

  ngOnInit(): void {
    if (this.serverSide()) {
      this.setDataRequest();
      this.getData();
    }
  }
  private getData() {
    const http = this.http();
    if (http) {
      http.pipe(takeUntilDestroyed()).subscribe({
        next: (data) => {
          this.options.update((prev) => {
            return {
              ...prev,
              data: data.data,
            };
          });

          this.data.emit(data);
        },
        error: (e: HttpErrorResponse) => {
          this.httpError.emit(e);
        },
      });
    }
  }
  private setDataRequest(): void {
    const options = this.options();
    const columns = convertToDTDataRequestColumn(
      [...options.columns],
      this.search
    );
    const order = options.order
      ? convertToDTDataRequestOrder(options.order)
      : [{ column: 0, dir: 'asc' }];

    this.httpService?.updateParams({
      start: options.start || 10,
      length: options.pageLength || 60,
      order,
      columns,
      search: this.search,
    });
  }

  private get search(): DTDataRequestSearch {
    return {
      value: '',
      regex: false,
    };
  }
  private setOptions(options: DTOptions<T>) {
    if (!this.serverSide()) {
      const { order, data } = options;
      if (order && data) {
        options.data = localSort<T>(this.columnsSortables(), order, data);
      }
    }
    this.options.set({
      ...this.options(),
      ...options,
    });
  }
  onColumnHeaderClick(columnIndex: number): void {
    const column = this.columns().find((_, index) => index === columnIndex);
    if (!column || column?.orderable === false) {
      return;
    }
    const currentOrder = this.options().order?.find(
      (o) => o[0] === columnIndex
    );
    let newDirection: DTOrderDirection = 'asc';
    if (currentOrder && currentOrder[1] === 'asc') {
      newDirection = 'desc';
    }
    if (!this.serverSide()) {
      this.setOptions({
        ...this.options(),
        columns: [
          ...this.columns().map((column, index) => {
            return {
              ...column,
              ordered: index === columnIndex ? newDirection : undefined,
            };
          }),
        ],
        order: [[columnIndex, newDirection]],
      });
      return;
    }
    this.getData();
  }

  searchData(e: string) {
    const { data } = this.options();
    if (!data) {
      return;
    }
    this.allData.set(searchData(data, e, this.columnsSearchable()));
  }
}
