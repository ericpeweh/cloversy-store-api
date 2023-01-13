const isDateBeforeCurrentTime = (dateStr: string) => {
	const current = Date.now();

	const dateToCheck = new Date(dateStr).getTime();

	return current >= dateToCheck;
};

export default isDateBeforeCurrentTime;
