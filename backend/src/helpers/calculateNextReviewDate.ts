const calculateNextReviewDate = (reviewCount: number) => {
	// Define intervals in milliseconds
	const intervals = [
		30 * 60 * 1000, // 30 minutes
		8 * 60 * 60 * 1000, // 8 hours
		24 * 60 * 60 * 1000, // 1 day
		2 * 24 * 60 * 60 * 1000, // 2 days
		4 * 24 * 60 * 60 * 1000, // 4 days
		7 * 24 * 60 * 60 * 1000, // 1 week
		15 * 24 * 60 * 60 * 1000, // 2 weeks
		30 * 24 * 60 * 60 * 1000, // 1 month
		60 * 24 * 60 * 60 * 1000, // 2 months
		90 * 24 * 60 * 60 * 1000, // 3 months
		180 * 24 * 60 * 60 * 1000, // 6 months
		365 * 24 * 60 * 60 * 1000, // 1 year
	];

	// Choose the interval based on the review count
	const interval = intervals[reviewCount] || intervals[intervals.length - 1];
	const nextReviewDate = new Date();
	nextReviewDate.setTime(nextReviewDate.getTime() + interval);

	return nextReviewDate;
};

module.exports = calculateNextReviewDate;
