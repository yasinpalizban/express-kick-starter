import {QueryFilter} from "@/libraries/QueryFilter";

export class SettingFilter extends QueryFilter {

  constructor() {
    super();
    this.safeParms = {
      id: ['eq', 'ne'],
      key: ['eq', 'ne', 'lik'],
      value: ['eq', 'ne', 'lik'],
      status: ['eq', 'ne'],
      description: ['eq', 'ne', 'lik'],
      createdAt: ['eq', 'ne', 'lik', 'gt', 'gte', 'lt', 'lte'],
      updatedAt: ['eq', 'ne', 'lik', 'gt', 'gte', 'lt', 'lte'],
      deletedAt: ['eq', 'ne', 'lik', 'gt', 'gte', 'lt', 'lte'],
    };
  }

}
