function areValuesNotFalsy(...values: any[]): boolean {
  for(const value of values) {
    if(!value) return false;
  }

  return true;
}

function isYearValid(str: string): boolean {
  if(str.length !== 4 || !parseInt(str)) return false;
  return true;
}

function isMonthValid(month: string): boolean {
  if(month.length !== 2) return false;

  const n = parseInt(month);
  if(!n || n > 12 || n < 1) return false;

  return true;
}

function isDayValid(day: string): boolean {
  if(day.length !== 2) return false;

  const n = parseInt(day);
  if(!n || n > 31 || n < 1) return false;

  return true;
}

// returns true if the date format is "YYYY-MM-DD"
export function isDateValid(date: string): boolean {
  const [year, month, day] = date.split("-");

  return areValuesNotFalsy(year, month, day)
    && isYearValid(year)
    && isMonthValid(month)
    && isDayValid(day);
}
