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
      userPermission: [RoleType.Admin],
      groupPermission: [RoleType.Admin],

      setting: [RoleType.Admin],
      visitor: [RoleType.Admin, RoleType.Coworker],

      chatContact: [RoleType.Admin, RoleType.Coworker, RoleType.Blogger],
      chatRoom: [RoleType.Admin, RoleType.Coworker, RoleType.Blogger],
      chatRoomMedia: [RoleType.Admin, RoleType.Coworker, RoleType.Blogger],
      chatPrivate: [RoleType.Admin, RoleType.Coworker, RoleType.Blogger],
      chatPrivateMedia: [RoleType.Admin, RoleType.Coworker, RoleType.Blogger],

      advertisement: [RoleType.Admin, RoleType.Coworker],
      advertisementMedia: [RoleType.Admin, RoleType.Coworker],

      contact: [RoleType.Admin, RoleType.Coworker],
      contactMedia: [RoleType.Admin, RoleType.Coworker],

      newsCategory: [RoleType.Admin, RoleType.Blogger],
      newsPost: [RoleType.Admin, RoleType.Blogger],
      newsMedia: [RoleType.Admin, RoleType.Blogger],
      newsComment: [RoleType.Admin, RoleType.Blogger],
      newsSubCategory: [RoleType.Admin, RoleType.Blogger],


      viewOption: [RoleType.Admin, RoleType.Coworker],
      viewMedia: [RoleType.Admin, RoleType.Coworker],

      requestCategory: [RoleType.Admin, RoleType.Coworker],
      requestPost: [RoleType.Admin, RoleType.Coworker, RoleType.Member],
      requestReply: [RoleType.Admin, RoleType.Coworker, RoleType.Member],

    };


    for (const key in listOfRule) {
      if (key.toLowerCase() === name.toLocaleLowerCase()) {

        return listOfRule[key];
      }
    }
    return null;

  }


}
