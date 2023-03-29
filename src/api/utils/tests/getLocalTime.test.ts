// Dependencies
import getLocalTime from "../getLocalTime";

describe("getLocalTime", () => {
	it("should return a string in ISO format", () => {
		const result = getLocalTime();
		expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}$/);
	});

	it("should return a local time with an additional offset", () => {
		const extraOffset = 30000; // 30 seconds
		const result = getLocalTime(extraOffset);
		const expected = new Date(
			Date.now() - new Date().getTimezoneOffset() * 60000 + extraOffset
		).toISOString();

		// Remove miliseconds digit to prevent time delay issue
		expect(result.slice(0, -2)).toEqual(expected.slice(0, -3));
	});

	it("should return a local time with a negative offset", () => {
		const extraOffset = -18000000; // -5 hours
		const result = getLocalTime(extraOffset);
		const expected = new Date(
			Date.now() - new Date().getTimezoneOffset() * 60000 + extraOffset
		).toISOString();

		// Remove miliseconds digit to prevent time delay issue
		expect(result.slice(0, -2)).toEqual(expected.slice(0, -3));
	});
});
