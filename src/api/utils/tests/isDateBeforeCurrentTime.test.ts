// Dependencies
import isDateBeforeCurrentTime from "../isDateBeforeCurrentTime";

describe("isDateBeforeCurrentTime", () => {
	it("should return true if date is before current time", () => {
		const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
		const result = isDateBeforeCurrentTime(pastDate);
		expect(result).toBe(true);
	});

	it("should return false if date is after current time", () => {
		const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
		const result = isDateBeforeCurrentTime(futureDate);
		expect(result).toBe(false);
	});

	it("should return true if date is equal to current time", () => {
		const currentDate = new Date().toISOString();
		const result = isDateBeforeCurrentTime(currentDate);
		expect(result).toBe(true);
	});

	it("should return false if date is invalid", () => {
		const invalidDate = "INVALID_DATE";
		const result = isDateBeforeCurrentTime(invalidDate);
		expect(result).toBe(false);
	});

	it("handles far future date (200 years from now)", () => {
		const futureDate = "2223-01-01T12:00:00.000Z";
		const result = isDateBeforeCurrentTime(futureDate);
		expect(result).toBe(false);
	});

	it("handles far past date (200 years before now)", () => {
		const futureDate = "1823-01-01T12:00:00.000Z";
		const result = isDateBeforeCurrentTime(futureDate);
		expect(result).toBe(true);
	});

	it("should return false if date is 10 miliseconds after current time", () => {
		const futureDate = new Date(Date.now() + 10).toISOString();
		const result = isDateBeforeCurrentTime(futureDate);
		expect(result).toBe(false);
	});

	it("should return false if date is 10 miliseconds before current time", () => {
		const futureDate = new Date(Date.now() - 10).toISOString();
		const result = isDateBeforeCurrentTime(futureDate);
		expect(result).toBe(true);
	});
});
