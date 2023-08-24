export interface IPusherChatPrivate {
  id: number;
  replyMessage?: string;
  message?: string;
  replyId: number;
  userReceiverId: number;
  userSenderId: number;
  createdAt: Date;
  media?: any[];
};

export interface IPusherChatRoom {
  id: number;
  replyMessage?: string;
  message?: string;
  replyId: number;
  userId: number;
  groupId: number;
  createdAt: Date;
  media?: any[];
}


export interface IPusherNotification {
  type: string;
  message: string;
  counter: number;
  date: string;
}




