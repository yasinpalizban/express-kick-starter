import {QueryFilter} from "@/libraries/QueryFilter";

export class UserFilter extends QueryFilter {

  constructor() {
    super();
    this.safeParms = {
      id: ['eq', 'ne'],
      username: ['eq', 'ne', 'lik'],
      email: ['eq', 'ne', 'lik'],
      phone: ['eq', 'ne', 'lik'],
      password: ['eq', 'ne', 'lik'],
      resetToken: ['eq', 'ne', 'lik'],
      resetEt: ['eq', 'ne', 'gte', 'gt', 'lte', 'lt'],
      resetExpires: ['eq', 'ne', 'gte', 'gt', 'lte', 'lt'],
      active: ['eq', 'ne', 'lik'],
      activeToken: ['eq', 'ne', 'lik'],
      activeExpires: ['eq', 'ne', 'gte', 'gt', 'lte', 'lt'],
      status: ['eq', 'ne'],
      statusMessage: ['eq', 'ne', 'lik'],
      createdAt: ['eq', 'ne', 'gte', 'gt', 'lte', 'lt'],
      updatedAt: ['eq', 'ne', 'gte', 'gt', 'lte', 'lt'],
      deletedAt: ['eq', 'ne', 'gte', 'gt', 'lte', 'lt'],
      firstName: ['eq', 'ne', 'lik'],
      lastName: ['eq', 'ne', 'lik'],
      image: ['eq', 'ne', 'lik'],
      gender: ['eq', 'ne'],
      birthday: ['eq', 'ne', 'lik'],
      country: ['eq', 'ne', 'lik'],
      city: ['eq', 'ne', 'lik'],
      address: ['eq', 'ne', 'lik'],
      title: ['eq', 'ne', 'lik'],
      bio: ['eq', 'ne', 'lik'],
      name: ['eq', 'ne', 'lik'],

    };
  }

}
