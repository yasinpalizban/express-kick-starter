import { IPagination } from '@/interfaces/pagination';
import { AggregatePipeLine } from '@/interfaces/urlAggressionInterface';

export interface  AggregationInterface
{
  aggregatePagination(nameModel: string, aggregatePipeLine: AggregatePipeLine): Promise<{ pagination: IPagination; data: any }>;
}
