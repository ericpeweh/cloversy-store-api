// Dependencies
import { Multer } from "multer";
import uploadFile from "../uploadFile";

interface MulterOpts extends Multer {
	limits: {
		fileSize: number;
	};
}

describe("upload middleware", () => {
	it("should export a multer object", () => {
		expect(uploadFile).toBeDefined();
	});

	it("should have required methods", () => {
		expect(uploadFile.single).toBeDefined();
		expect(typeof uploadFile.single).toBe("function");

		expect(uploadFile.array).toBeDefined();
		expect(typeof uploadFile.array).toBe("function");
	});

	it("should limit the file size of uploaded files to 10MB", () => {
		const uploadWithOpts = uploadFile as MulterOpts;
		expect(uploadWithOpts.limits.fileSize).toEqual(10 * 1024 * 1024);
	});
});
