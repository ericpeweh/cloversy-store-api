// Dependencies
import multer from "multer";
import path from "path";

const createMulterMiddleware = () => {
	return multer({
		dest: path.join(process.cwd(), "/uploads"),
		limits: {
			fileSize: 10 * 1024 * 1024
		}
	});
};

export default createMulterMiddleware();
