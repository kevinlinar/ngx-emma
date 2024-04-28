export interface DTHttp {
  url: string;
  method: 'post' | 'get';
  headers?: { [key: string]: string };
  data?:
    | { [key: string]: string | number | boolean | object | null | undefined }
    | [string | number | boolean | object | null | undefined]
    | null;
  dtParameters?: DTDataRequest;
}

export interface DTHttpResponse<T> {
  recordsTotal: number;
  recordsFiltered: number;
  data: T[];
}

export interface DTDataRequest {
  start: number;
  length: number;
  order: DTDataRequestOrder[];
  columns: DTDataRequestColumn[];
  search: DTDataRequestSearch;
  data?: DTHttp['data'];
}

export interface DTDataRequestSearch {
  value: string;
  regex: boolean;
}

export interface DTDataRequestOrder {
  column: number;
  dir: string;
}

export interface DTDataRequestColumn {
  data: string;
  name: string;
  searchable: boolean;
  orderable: boolean;
  search: DTDataRequestSearch;
}
