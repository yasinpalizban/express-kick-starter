import {QueryFilter} from "@/libraries/QueryFilter";

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
