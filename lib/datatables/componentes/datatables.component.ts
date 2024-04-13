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
import { DTLangEs, DTOptionsDefault } from '../constants';
import { DeepAccessPipe } from '../pipes/deep-access.pipe';
import { DTHttpService } from '../services/dt-http.service';
import {
  DTColumns,
  DTDataRequestColumn,
  DTDataRequestOrder,
  DTDataRequestSearch,
  DTHttpResponse,
  DTOptions,
} from '../types';

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
  protected showData = signal<T[]>([]);
  options = model<DTOptions<T>>({
    columns: [],
    data: [],
    serverSide: true,
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
    this.setDataRequest();
    if (this.serverSide()) {
      this.getData();
    }
  }
  private getData() {
    const http = this.http();
    if (http) {
      http.subscribe({
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
    const columns = this.convertColumns([...options.columns]);
    const order = options.order
      ? this.convertToDTDataRequestOrder(options.order)
      : [{ column: 0, dir: 'asc' }];

    this.httpService.updateParams({
      start: options.displayStart || 10,
      length: options.pageLength || 60,
      order,
      columns,
      search: this.search,
    });
  }
  private convertToDTDataRequestOrder(
    input: [number, string][]
  ): DTDataRequestOrder[] {
    return input.map(([column, dir]) => ({
      column,
      dir,
    }));
  }
  private get search(): DTDataRequestSearch {
    return {
      value: '',
      regex: false,
    };
  }
  private convertColumns(columns: DTColumns[]): DTDataRequestColumn[] {
    return columns.map((col) => {
      const data = col.data ?? '';
      const name = col.name ?? '';
      const searchable = col.searchable ?? false;
      const orderable = col.orderable ?? false;
      const search = this.search;
      return {
        data,
        name,
        searchable,
        orderable,
        search,
      };
    });
  }
  private setOptions(options: DTOptions<T>) {
    this.options.set({
      ...this.options(),
      ...options,
    });
  }
}
