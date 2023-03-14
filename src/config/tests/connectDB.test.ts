// Mocks
jest.mock("pg");
jest.mock("dotenv", () => ({
	config: () => {
		process.env.DATABASE_URL = "postgres://user:password@localhost/database_name";
	}
}));

// Dependencies
import { Pool } from "pg";
import connectDB from "../connectDB";

const { pool: poolInstance, onConnect, onError } = connectDB;

describe("connectDB", () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	it("should create a new Pool object with the correct connection string", () => {
		const expectedOptions = {
			connectionString: process.env.DATABASE_URL
		};

		expect(poolInstance).toBeDefined();
		expect(Pool).toHaveBeenCalledWith(expectedOptions);
	});

	it("should return a successful query result", async () => {
		const mockQuery = jest.fn().mockResolvedValueOnce({ rows: [1, 2, 3] });
		jest.spyOn(poolInstance, "query").mockImplementationOnce(mockQuery);

		const queryText = "SELECT * FROM table_name";
		const queryParams: string[] = [];

		const result = await poolInstance.query(queryText, queryParams);

		// Assert query was called with expected args and returning correct result
		expect(result).toEqual({ rows: [1, 2, 3] });
		expect(mockQuery).toHaveBeenCalledWith(queryText, queryParams);
	});

	it("should handle a failed query", async () => {
		const mockQuery = jest.fn().mockRejectedValueOnce(new Error("Invalid query!"));
		jest.spyOn(poolInstance, "query").mockImplementationOnce(mockQuery);

		const queryText = "SELECT * FROM table_name";
		const queryParams: string[] = [];

		await expect(poolInstance.query(queryText, queryParams)).rejects.toThrow("Invalid query!");
		expect(mockQuery).toHaveBeenCalledWith(queryText, queryParams);
	});

	it("should log a success message when pool is connected", () => {
		const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
		onConnect();

		expect(consoleSpy).toHaveBeenCalledWith("Database pool connected");
	});

	it("should log an error message when the pool encounters an error", () => {
		const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
		const error = new Error("Connection Error!");
		onError(error);

		expect(consoleErrorSpy).toHaveBeenCalledWith("Database pool error: ", error);
	});
});
