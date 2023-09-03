import {QueryFilter} from "@/libraries/query.filter";

export class GroupFilter extends QueryFilter {

  constructor() {
    super();
    this.safeParms = {
      id: ['eq', 'ne'],
      name: ['eq', 'ne', 'lik'],
      description: ['eq', 'ne', 'lik'],
    };
  }


}
