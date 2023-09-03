import {QueryFilter} from "@/libraries/query.filter";

export class PermissionUserFilter extends QueryFilter {

  constructor() {
    super();
    this.safeParms = {
      id: ['eq', 'ne'],
      actions: ['eq', 'ne'],
      userId: ['eq', 'ne'],
      permissionId: ['eq', 'ne'],
    };
  }


}
