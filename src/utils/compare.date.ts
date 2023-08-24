export function compareDate(first: Date, second: Date): boolean {
  return first < second;
}

export function compareDateTime(first: Date, second: Date): number {
  if (first == second) {
    return 0;
  } else if (first < second) {
    return 1;
  } else if (first > second) {
    return -1;
  }
}
