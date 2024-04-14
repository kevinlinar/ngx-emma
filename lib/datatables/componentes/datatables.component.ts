import { HttpErrorResponse } from '@angular/common/http';
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
import { DTLangEs, DTOptionsDefault } from '../constants';
import { DeepAccessPipe } from '../pipes/deep-access.pipe';
import { DTHttpService } from '../services/dt-http.service';
import { DTDataRequestSearch, DTHttpResponse, DTOptions } from '../types';
import { convertToDTDataRequestColumn } from '../utils/convert-to-dt-data-request-column';
import { convertToDTDataRequestOrder } from '../utils/convert-to-td-data-request-order';
import { filterData } from '../utils/filter-data';
import { localSort } from '../utils/local-sort';

@Component({
  selector: 'ngx-emma-datatables',
  standalone: true,
  templateUrl: './datatables.component.html',
  styleUrl: './datatables.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DeepAccessPipe],
})
export class DatatablesComponent<T> implements OnInit {
  private httpService = inject(DTHttpService);
  protected httpError = output<HttpErrorResponse>();
  protected data = output<DTHttpResponse<T>>();
  private http = computed(() => this.options().http);
  private serverSide = computed(() => this.options().serverSide);
  protected columns = computed(() => this.options().columns);
  protected columnsSortables = computed(() =>
    this.columns().filter((columns) => columns.orderable !== false)
  );
  protected columnsSearchable = computed(() =>
    this.columns().filter((columns) => columns.searchable !== false)
  );
  protected showData = signal<T[]>([]);
  options = model<DTOptions<T>>({
    columns: [],
    data: [],
    language: DTLangEs,
  });
  constructor() {
    effect(() => {
      const options = this.options();
      untracked(() => {
        this.showData.set(options.data || []);
      });
    });
  }

  ngOnInit(): void {
    this.setOptions({ ...(DTOptionsDefault as T), ...this.options() });
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

    this.httpService.updateParams({
      start: options.displayStart || 10,
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
    if (column?.orderable === false) {
      return;
    }
    const currentOrder = this.options().order?.find(
      (o) => o[0] === columnIndex
    );
    let newDirection = 'asc';
    if (currentOrder && currentOrder[1] === 'asc') {
      newDirection = 'desc';
    }
    if (!this.serverSide()) {
      this.setOptions({
        ...this.options(),
        order: [[columnIndex, newDirection]],
      });
      return;
    }
    this.getData();
  }

  filterData(e: string) {
    const { data } = this.options();
    if (!data) {
      return;
    }
    this.showData.set(filterData(data, e, this.columnsSearchable()));
  }
}
