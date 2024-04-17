import { Observable } from 'rxjs';
import { DTClassName } from './dt-class-name';
import { DTColumns, DTOrderDirection } from './dt-columns';
import { DTHttpResponse } from './dt-http';
import { DTLanguage } from './dt-language';

export interface DTOptions<T> {
  columns: DTColumns[];
  data?: T[];
  serverSide?: boolean;
  http?: Observable<DTHttpResponse<T>>;
  className?: DTClassName;
  language?: DTLanguage;
  autoWidth?: boolean;
  lengthChange?: boolean;
  ordering?: boolean;
  paging?: boolean;
  scrollX?: boolean;
  scrollY?: string;
  start?: number;
  pageLength?: number;
  lengthMenu?: number[];
  search?: string;
  searchPlaceholder?: string;
  searchDelay?: number;
  order?: [number, DTOrderDirection][];
  fixedColumns?: {
    left?: number | undefined;
    right?: number | undefined;
  };
  select?: Select;
}

export interface Select {
  style?: string;
  selector?: string;
  targets?: number;
  data?: string | null;
  defaultContent?: string;
  orderable?: boolean;
  className?: string | null;
}
