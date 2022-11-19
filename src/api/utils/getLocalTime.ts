const getLocalTime = () => {
	const timezoneOffsetInMs = new Date().getTimezoneOffset() * 60000;
	const localISOTime = new Date(Date.now() - timezoneOffsetInMs).toISOString().slice(0, -1);

	return localISOTime;
};

export default getLocalTime;
