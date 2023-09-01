import {QueryFilter} from "@/libraries/QueryFilter";

export class PermissionGroupFilter extends QueryFilter {

  constructor() {
    super();
    this.safeParms = {
      id: ['eq', 'ne'],
      actions: ['eq', 'ne'],
      groupId: ['eq', 'ne'],
      permissionId: ['eq', 'ne'],
    };
  }

}
