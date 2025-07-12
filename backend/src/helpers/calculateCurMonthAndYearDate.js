const { StatusCodes } = require("http-status-codes");

function calculateCurMonthAndYearDate(month, year, res) {
	const intMonth = Number.parseInt(month, 10);
	const intYear = Number.parseInt(year, 10);
	if (
		Number.isNaN(intMonth) ||
		Number.isNaN(intYear) ||
		intMonth < 1 ||
		intMonth > 12
	) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: true, message: "Invalid month or year" });
	}

	const startDate = new Date(intYear, intMonth - 1, 1); // Month is 0-indexed in JavaScript Date
	const endDate = new Date(intYear, intMonth, 0, 23, 59, 59, 999); // Last day of the month

	return { startDate, endDate };
}

module.exports = { calculateCurMonthAndYearDate };
