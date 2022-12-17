const isDateSurpassToday = (dateStr: string) => {
	const timezoneOffsetInMs = new Date().getTimezoneOffset() * 60000;
	const current = Date.now() - timezoneOffsetInMs;

	const dateToCheck = new Date(dateStr).getTime();

	return current >= dateToCheck;
};

export default isDateSurpassToday;
