import CryptoJS from 'crypto-js';
import { PASSWORD_KEY } from '../configs/config';;

export function generateHashCode(): string {
  const nonce: number = Math.round(100);
  const secretKey: string = PASSWORD_KEY;
  return CryptoJS.SHA256(nonce + secretKey).toString(CryptoJS.enc.Hex);

}
