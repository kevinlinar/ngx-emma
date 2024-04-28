export interface PaginatorOptions {
  disabled?: boolean;
  showFirstLastButtons?: boolean;
  hidePageSize?: boolean;
  hidePageNumber?: boolean;
  className?: string;
}
export interface Paginator extends PaginatorOptions {
  length: number;
  pageSize: number;
  currentPage: number;
}
