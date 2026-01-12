export function getDatePlusMonths(months) {
	const todayDate = new Date();
	todayDate.setMonth(todayDate.getMonth() + months);

	const dd = String(todayDate.getDate()).padStart(2, '0');
	const mm = String(todayDate.getMonth() + 1).padStart(2, '0');
	const yyyy = todayDate.getFullYear();

	return `${yyyy}-${mm}-${dd}`;
}
export default getDatePlusMonths;
