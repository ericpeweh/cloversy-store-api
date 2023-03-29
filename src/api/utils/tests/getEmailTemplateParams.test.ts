// Dependencies
import getEmailTemplateParams from "../getEmailTemplateParams";

describe("getEmailTemplateParams", () => {
	it("should return an empty array when no template parameters are found", () => {
		const htmlContent = "<p>This is a test email</p>";
		const result = getEmailTemplateParams(htmlContent);
		expect(result).toEqual([]);
	});

	it("should return a single template parameter", () => {
		const htmlContent = "<p>Hello {{params.name}},</p>";
		const result = getEmailTemplateParams(htmlContent);
		expect(result).toEqual(["name"]);
	});

	it("should return multiple template parameters in the order they appear in the HTML content", () => {
		const htmlContent = "<p>Hello {{params.name}},</p><p>How are you {{params.greet}}?</p>";
		const result = getEmailTemplateParams(htmlContent);
		expect(result).toEqual(["name", "greet"]);
	});

	it("should ignore duplicate template parameters", () => {
		const htmlContent = "<p>Hello {{params.name}},</p><p>How are you {{params.name}}?</p>";
		const result = getEmailTemplateParams(htmlContent);
		expect(result).toEqual(["name"]);
	});

	it("should return unique template parameters even if they appear in different formats", () => {
		const htmlContent =
			"<p>Hello {{params.name}},</p><p>How are you {{params.first_name}}?</p><p>Regards, {{params.NAME}}</p>";
		const result = getEmailTemplateParams(htmlContent);
		expect(result).toEqual(["name", "first_name", "NAME"]);
	});

	it("should return empty array when template is empty string", () => {
		const result = getEmailTemplateParams("");
		expect(result).toEqual([]);
	});
});
