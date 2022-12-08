export interface Pageable {
  sort: Sort;
  pageNumber: number;
  pageSize: number;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface Page<T> {
  content: T[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  sort: Sort;
  numberOfElements: number;
  size: number;
  number: number;
  empty: boolean;
}

export interface PageRequest {
  size: number;
  page: number;
  sort?: string[];
}
