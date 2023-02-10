const getLocalTime = (extraOffset = 0) => {
	// extraOffset = miliseconds
	const timezoneOffsetInMs = new Date().getTimezoneOffset() * 60000;
	const localISOTime = new Date(Date.now() - timezoneOffsetInMs + extraOffset)
		.toISOString()
		.slice(0, -1);

	return localISOTime;
};

export default getLocalTime;
