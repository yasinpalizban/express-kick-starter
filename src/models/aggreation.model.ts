import { DataTypes, Model, Sequelize} from 'sequelize';
import { AggregationInterface } from 'interfaces/aggregation.interface';
import { IPagination } from '../interfaces/pagination';
import { paginationFields } from '@/utils/pagntaion.fields';
import { AggregatePipeLine } from '../interfaces/urlAggressionInterface';

export class AggregationModel extends Model implements AggregationInterface {
  async aggregatePagination(nameModel: string, aggregatePipeLine: AggregatePipeLine): Promise<{ data: any[]; pagination: IPagination }> {
    const { count, rows } = await AggregationModel.sequelize.models[nameModel].findAndCountAll(aggregatePipeLine);
    const pagination: IPagination = paginationFields(aggregatePipeLine.limit, aggregatePipeLine.page, count);
    return { data: rows, pagination: pagination };
  }
}

export function aggregationModel(sequelize: Sequelize): AggregationModel {
  AggregationModel.init({},{ sequelize });
  return new AggregationModel();
}
