// Match for any word starting with "{{" followed by any characters and end with "}}"
const paramsMatcher = /(\{\{).*?(\}\})/g;

const getEmailTemplateParams = (htmlContent: string) => {
	const matchs = [...htmlContent.matchAll(paramsMatcher)];

	const params: string[] = [];
	for (const match of matchs) {
		const param = match[0].slice(9, -2);
		params.push(param);
	}

	const uniqueParams = [...new Set(params)];

	return uniqueParams;
};

export default getEmailTemplateParams;
