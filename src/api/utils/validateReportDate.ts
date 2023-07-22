const validateReportDate = (dateStr: string) => {
	const regex = /^\d{4}-\d{2}-\d{2}$/;

	return regex.test(dateStr);
};

export default validateReportDate;
