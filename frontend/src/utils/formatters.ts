export function getNumbersFromStr(str: string): string {
  return str.replace(/[^0-9]/g, "");
}
