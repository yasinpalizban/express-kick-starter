import { RoleType } from "../enums/role.type.enum";

export class RoleRouteService {
  public getRoleAccess(name: string): [] | null {
    const listOfRule = {
      profile: null,
      graph: [RoleType.Admin, RoleType.Coworker, RoleType.Blogger],
      overView: [RoleType.Admin, RoleType.Coworker, RoleType.Blogger],

      user: [RoleType.Admin],
      group: [RoleType.Admin],
      permission: [RoleType.Admin],
      permissionUser: [RoleType.Admin],
      permissionGroup: [RoleType.Admin],

      setting: [RoleType.Admin],
      visitor: [RoleType.Admin, RoleType.Coworker],




    };


    for (const key in listOfRule) {
      if (key.toLowerCase() === name.toLocaleLowerCase()) {

        return listOfRule[key];
      }
    }
    return null;

  }


}
