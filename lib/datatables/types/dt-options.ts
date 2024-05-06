import { PaginatorOptions } from 'ngx-emma/paginator';
import { SearchOptions } from 'ngx-emma/search';
import { DTClassName } from './dt-class-name';
import { DTColumns } from './dt-columns';
import { DTFixedColumns } from './dt-fixed-columns';
import { DTHttp } from './dt-http';
import { DTLanguage } from './dt-language';
import { DTLengthMenu } from './dt-length-menu';
import { DTOrderColumns } from './dt-order-columns';
import { DTSelect } from './dt-select';

export interface DTOptions<T> {
  columns: DTColumns[];
  data?: T[];
  serverSide?: boolean;
  http?: DTHttp<T>;
  className?: DTClassName;
  language?: DTLanguage;
  autoWidth?: boolean;
  pagingInfo?: boolean;
  scrollX?: boolean;
  scrollY?: string;
  displayStart?: number;
  lengthMenu?: DTLengthMenu;
  searchOptions?: SearchOptions;
  ordering?: boolean;
  order?: DTOrderColumns;
  paginator?: PaginatorOptions;
  select?: DTSelect;
  fixedColumns?: DTFixedColumns;
}
