import {Op} from 'sequelize';

export function convertSignType(sign: string | string[], value: number | string | string[] | number[]): any {
  switch (sign) {
    case '!=':
      return {[Op.ne]: value};
    case '>':
      return {[Op.gt]: value};
    case '=>':
      return {[Op.gte]: value};
    case '<':
      return {[Op.lt]: value};
    case '=<':
      return {[Op.lte]: value};
    case '=':
      return {[Op.eq]: value};
    default:
      return {[Op.like]: '%' + value + '%'};
  }
}


export function parseString(str: string): string {
  // %
  while (true) {
    str = decodeURIComponent(str);
    if (str.indexOf('%') == -1) {
      break;
    }
  }

  return str;
}

export function changeKeyObject(obj: object, oldKey: string, newKey: string): object {
  return JSON.parse(JSON.stringify(obj).split(oldKey).join(newKey));
}





