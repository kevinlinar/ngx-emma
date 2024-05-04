export interface DTHttp<T> {
  url: string;
  method?: 'post' | 'get';
  headers?: { [key: string]: string };
  data?: anyData;
  pipeResponse?: (response: T[]) => DTHttpResponse<T>;
}

export interface DTHttpRequest {
  dtParameters?: DTDataRequest;
}

export interface DTHttpResponse<T> {
  data: T[];
  recordsTotal?: number;
  recordsFiltered?: number;
}

export type anyData =
  | { [key: string]: string | number | boolean | object | null | undefined }
  | [string | number | boolean | object | null | undefined]
  | null;

export interface DTDataRequest {
  start: number;
  length: number;
  order: DTDataRequestOrder[];
  columns: DTDataRequestColumn[];
  search: DTDataRequestSearch;
  data?: anyData;
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
