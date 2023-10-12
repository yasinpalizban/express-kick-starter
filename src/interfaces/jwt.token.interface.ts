export interface DataStoredInToken {
  id: number;
}

export interface TokenData {
  token: string;
  expire: number;
  maxAge: number;
}

export interface IRefreshToken {
  cookie: string;
  jwt: TokenData
}
