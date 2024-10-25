// isoDate is a date in the form: YYYY-MM-DD
// this function formats the date into: DD-MM-YYYY
export function getFormattedDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}-${month}-${year}`;
}
