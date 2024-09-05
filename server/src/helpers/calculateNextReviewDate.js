
const calculateNextReviewDate = (reviewCount) => {
    const intervals = [1, 3, 7, 14, 30];
    const daysToAdd = intervals[reviewCount - 1] || 30;
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + daysToAdd);
    return nextReviewDate;
}

module.exports = calculateNextReviewDate;