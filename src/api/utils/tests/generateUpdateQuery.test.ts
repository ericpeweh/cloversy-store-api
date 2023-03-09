// Dependencies
import generateUpdateQuery from "../generateUpdateQuery";

describe("generateUpdateQuery", () => {
	it("generates update query with table name and data", () => {
		const result = generateUpdateQuery("tableName", { columnA: "valueA", columnB: 42 });
		expect(result.query).toBe("UPDATE tableName SET columnA = $1, columnB = $2");
		expect(result.params).toEqual(["valueA", 42]);
		expect(result.index).toBe(3);
	});

	it("does not include undefined values or read-only columns in query", () => {
		const result = generateUpdateQuery(
			"tableName",
			{ columnA: "valueA", columnB: undefined, readOnlyColumn: "shouldNotBeIncluded" },
			undefined,
			undefined,
			1,
			["readOnlyColumn"]
		);
		expect(result.query).toBe("UPDATE tableName SET columnA = $1");
		expect(result.params).toEqual(["valueA"]);
		expect(result.index).toBe(2);
	});

	it("generates update query with identifier and extra", () => {
		const result = generateUpdateQuery(
			"tableName",
			{ columnA: "valueA" },
			{ id: 123 },
			" RETURNING *",
			1
		);
		expect(result.query.replace(/\s{2,}/g, " ")).toBe(
			"UPDATE tableName SET columnA = $1 WHERE id = $2 RETURNING *".replace(/\s{2,}/g, " ")
		);
		expect(result.params).toEqual(["valueA", 123]);
		expect(result.index).toBe(3);
	});

	it("handles startIndex parameter", () => {
		const result = generateUpdateQuery(
			"tableName",
			{ columnA: "valueA", columnB: "valueB" },
			undefined,
			undefined,
			10
		);
		expect(result.query).toBe("UPDATE tableName SET columnA = $10, columnB = $11");
		expect(result.params).toEqual(["valueA", "valueB"]);
		expect(result.index).toBe(12);
	});

	it("handles empty data object", () => {
		const result = generateUpdateQuery("tableName", {});
		expect(result.query).toBe("");
		expect(result.params).toEqual([]);
		expect(result.index).toBe(1);
	});

	it("handles empty identifier object", () => {
		const result = generateUpdateQuery("tableName", { columnA: "valueA" }, {});
		expect(result.query).toBe("UPDATE tableName SET columnA = $1");
		expect(result.params).toEqual(["valueA"]);
		expect(result.index).toBe(2);
	});

	it("handles extra parameter as undefined", () => {
		const result = generateUpdateQuery(
			"tableName",
			{ columnA: "valueA" },
			undefined,
			undefined,
			undefined,
			[]
		);
		expect(result.query).toBe("UPDATE tableName SET columnA = $1");
		expect(result.params).toEqual(["valueA"]);
		expect(result.index).toBe(2);
	});

	it("handles empty array readOnly parameter", () => {
		const result = generateUpdateQuery(
			"tableName",
			{ columnA: "valueA", columnB: "valueB" },
			undefined,
			undefined,
			undefined,
			[]
		);
		expect(result.query).toBe("UPDATE tableName SET columnA = $1, columnB = $2");
		expect(result.params).toEqual(["valueA", "valueB"]);
		expect(result.index).toBe(3);
	});

	it("handles undefined readOnly parameter", () => {
		const result = generateUpdateQuery(
			"tableName",
			{ columnA: "valueA", columnB: "valueB" },
			undefined,
			undefined,
			undefined,
			undefined
		);
		expect(result.query).toBe("UPDATE tableName SET columnA = $1, columnB = $2");
		expect(result.params).toEqual(["valueA", "valueB"]);
		expect(result.index).toBe(3);
	});
});
