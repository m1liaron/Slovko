import { HttpError } from "@/libs/constants";

function calculateCurMonthAndYearDate(
  month: number | string,
  year: number | string,
): { startDate: Date; endDate: Date } | any {
  const intMonth = Number.parseInt(String(month), 10);
  const intYear = Number.parseInt(String(year), 10);
  if (
    Number.isNaN(intMonth) ||
    Number.isNaN(intYear) ||
    intMonth < 1 ||
    intMonth > 12
  ) {
    throw HttpError.badRequest("Invalid month or year");
  }

  const startDate = new Date(intYear, intMonth - 1, 1); // Month is 0-indexed in JavaScript Date
  const endDate = new Date(intYear, intMonth, 0, 23, 59, 59, 999); // Last day of the month

  return { startDate, endDate };
}

export { calculateCurMonthAndYearDate };
