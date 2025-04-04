export default function formatDMTDate(propsDate: Date) {
	const date = new Date(propsDate);
	const day = date.getDay();
	const month = date.getMonth() + 1;
	const hours = date.getHours();
	const minutes = date.getMinutes();

	return `${day}.${month}, ${hours}:${minutes}`;
}
