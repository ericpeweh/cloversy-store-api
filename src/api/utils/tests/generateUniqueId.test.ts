// Dependencies
import generateUniqueId from "../generateUniqueId";

describe("Genarate Unique Id", () => {
	it("should generate a random id with 10 digits by default", () => {
		const uniqueId = generateUniqueId();
		expect(uniqueId).toHaveLength(10);
		expect(uniqueId).toMatch(/^[0-9A-Z]{10}/);
	});

	it("should generate a random id with custom digits", () => {
		const uniqueId1 = generateUniqueId(1);
		expect(uniqueId1).toHaveLength(1);
		expect(uniqueId1).toMatch(/^[0-9A-Z]{1}/);

		const uniqueId5 = generateUniqueId(5);
		expect(uniqueId5).toHaveLength(5);
		expect(uniqueId5).toMatch(/^[0-9A-Z]{5}/);

		const uniqueId15 = generateUniqueId(15);
		expect(uniqueId15).toHaveLength(15);
		expect(uniqueId15).toMatch(/^[0-9A-Z]{15}/);
	});

	it("should generate a random id with custom alphabet", () => {
		const uniqueId1 = generateUniqueId(undefined, "ABCDE");
		expect(uniqueId1.length).toBe(10);
		expect(uniqueId1).toMatch(/^[ABCDE]{10}$/);

		const uniqueId2 = generateUniqueId(undefined, "0123456789");
		expect(uniqueId2.length).toBe(10);
		expect(uniqueId2).toMatch(/^[0-9]{10}$/);

		const uniqueId3 = generateUniqueId(undefined, "!@#$%^&*().,/~+_|{}");
		expect(uniqueId3.length).toBe(10);
		expect(uniqueId3).toMatch(/^[!@#$%^&*().,/~+_|{}]{10}$/);
	});

	it("should generate a random id with custom digits and alphabet", () => {
		const uniqueId1 = generateUniqueId(20, "XYZ");
		expect(uniqueId1.length).toBe(20);
		expect(uniqueId1).toMatch(/^[XYZ]{20}$/);

		const uniqueId2 = generateUniqueId(7, "0123456789");
		expect(uniqueId2.length).toBe(7);
		expect(uniqueId2).toMatch(/^[0-9]{7}$/);

		const uniqueId3 = generateUniqueId(100, "!@#$%^&*().,/~+_|{}");
		expect(uniqueId3.length).toBe(100);
		expect(uniqueId3).toMatch(/^[!@#$%^&*().,/~+_|{}]{100}$/);
	});

	it("should return empty string if digits is 10", () => {
		const uniqueId = generateUniqueId(0);
		expect(uniqueId).toHaveLength(0);
		expect(uniqueId).toEqual("");
	});

	it("should return empty string if alphabet is empty string", () => {
		const uniqueId = generateUniqueId(undefined, "");
		expect(uniqueId).toHaveLength(0);
		expect(uniqueId).toEqual("");
	});
});
