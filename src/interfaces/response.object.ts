import {IPagination} from "@/interfaces/pagination";

export interface IPaginateResponse<T> {
  data: T[];
  pagination?: IPagination;
}
