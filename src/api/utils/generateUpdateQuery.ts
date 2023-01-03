const generateUpdateQuery = (
	tableName: string,
	data: { [key: string]: any },
	identifier?: { [key: string]: string | number },
	extra?: string,
	startIndex?: number,
	readOnly?: string[]
) => {
	const queryParams: (string | number)[] = [];
	let query = "";
	let queryIndex = startIndex || 1;

	// Set part
	query += `UPDATE ${tableName} SET`;
	const pairs = Object.entries(data);
	pairs.forEach(([key, value]) => {
		if (value !== undefined && !readOnly?.includes(key)) {
			queryParams.push(value);
			query += ` ${key} = $${queryIndex},`;
			queryIndex += 1;
		}
	});
	query = query.slice(0, -1); // remove comma

	// Where part (ex: id)
	if (identifier) {
		query += ` WHERE`;
		const identifierPairs = Object.entries(identifier);
		identifierPairs.forEach(([key, value], index) => {
			if (value !== undefined) {
				queryParams.push(value);
				query += ` ${index > 0 ? "AND" : ""} ${key} = $${queryIndex}`;
				queryIndex += 1;
			}
		});
	}

	// Extra part
	if (extra) {
		query += extra;
	}

	return { query, params: queryParams, index: queryIndex };
};

export default generateUpdateQuery;
