export interface Paginator {
  length: number;
  pageSize: number;
  currentPage?: number;
  disabled?: boolean;
  showFirstLastButtons?: boolean;
  pageSizeOptions?: number[];
  hidePageSize?: boolean;
  hidePageNumber?: boolean;
  className?: string;
}
