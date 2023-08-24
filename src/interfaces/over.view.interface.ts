import { IVisitor } from '@/interfaces/visitor.interface';
import { IUser } from '@/interfaces/user.interface';
import { IRequestPost } from '@/interfaces/request.post.interface';
import { IContact } from '@/interfaces/contact.interface';
import { INewsPost } from "@/interfaces/news.post.interface";

export interface IOverView {
  visitorPost?: IVisitor[];
  userPost?: IUser[];
  requestPost?: IRequestPost[];
  newsPost?: INewsPost[];
  contactPost?: IContact[];
  countPost?: {
    users: number;
    contacts: number;
    requests: number;
    visitors: number;
    news: number;
  };
}
