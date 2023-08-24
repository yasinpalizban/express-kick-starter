export interface IPagination {

  hasMore?: boolean;
  perPage?: number;
  pageCount?: number;
  total?: number;
  currentPage?: number;
  next?: number | null | undefined;
  previous?: number | null | undefined;


}
