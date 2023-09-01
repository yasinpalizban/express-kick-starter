import {QueryFilter} from "@/libraries/QueryFilter";

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
