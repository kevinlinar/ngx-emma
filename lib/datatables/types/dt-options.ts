import { PaginatorOptions } from 'ngx-emma/paginator';
import { SearchOptions } from 'ngx-emma/search';
import { DTClassName } from './dt-class-name';
import { DTColumns, DTOrderDirection } from './dt-columns';
import { DTHttp } from './dt-http';
import { DTLanguage } from './dt-language';

export interface DTOptions<T> {
  columns: DTColumns[];
  data?: T[];
  serverSide?: boolean;
  //http?: Observable<DTHttpResponse<T>>;
  http?: DTHttp<T>;
  className?: DTClassName;
  language?: DTLanguage;
  autoWidth?: boolean;
  lengthChange?: boolean;
  ordering?: boolean;
  paging?: boolean;
  pagingInfo?: boolean;
  search?: boolean;
  scrollX?: boolean;
  scrollY?: string;
  displayStart?: number;
  pageLength?: number;
  lengthMenu?: number[];
  searchOptions?: SearchOptions;
  order?: DTOrderColumns;
  paginatorOptions?: PaginatorOptions;
  select?: DTSelect;
  fixedColumns?: DTFixedColumns;
}

export interface DTFixedColumns {
  left?: number | undefined;
  right?: number | undefined;
}

export type DTOrderColumns = [number, DTOrderDirection][];
export interface DTSelect {
  style?: string;
  selector?: string;
  targets?: number;
  data?: string | null;
  defaultContent?: string;
  orderable?: boolean;
  className?: string | null;
}
