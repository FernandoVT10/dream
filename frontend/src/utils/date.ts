// isoDate is a date in the form: YYYY-MM-DD
// this function formats the date into: DD-MM-YYYY
export function getFormattedDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}-${month}-${year}`;
}

// returns actual date in the form yyyy-mm-dd
export function getISODate(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}
