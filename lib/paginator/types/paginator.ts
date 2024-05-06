export interface PaginatorOptions {
  disabled?: boolean;
  showFirstLastButtons?: boolean;
  hidePageSize?: boolean;
  hidePageNumber?: boolean;
  className?: string;
  visible?: boolean;
}
export interface Paginator extends PaginatorOptions {
  length: number;
  pageSize: number;
  currentPage: number;
}
