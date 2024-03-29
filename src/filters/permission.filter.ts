import {QueryFilter} from "@/libraries/query.filter";

export class PermissionFilter extends QueryFilter {

  constructor() {
    super();
    this.safeParms = {
      id: ['eq', 'ne'],
      name: ['eq', 'ne', 'lik'],
      active: ['eq', 'ne'],
      description: ['eq', 'ne', 'lik'],
    };
  }


}
