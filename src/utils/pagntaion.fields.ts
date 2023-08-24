import { IPagination } from '../interfaces/pagination';

export function paginationFields(limit: number, nowPage: number, total: number): IPagination {

  const pages: number = Math.ceil(total / limit);
  return {
    hasMore: pages > nowPage,
    total: total,
    perPage: limit,
    pageCount: pages,
    currentPage: nowPage,
    next: pages > nowPage ? nowPage + 1 : nowPage,
    previous: pages < nowPage ? nowPage - 1 : nowPage - 1,
  };
}
