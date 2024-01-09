import {IBasic} from "@/interfaces/Basic";

export interface IUser extends  IBasic{

  login?: string;
  group?: string;
  groupId?: number;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  image: string;
  address: string;
  gender: boolean;
  country: string;
  city: string;
  active: boolean;
  activeToken: string;
  activeExpires: Date;
  status: boolean;
  statusMessage: string;
  resetToken: string;
  resetExpires: Date;
  resetAt: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  title: string;
  bio: string;
}

