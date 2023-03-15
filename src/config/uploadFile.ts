// Dependencies
import multer from "multer";
import path from "path";

// Utils
import { ErrorObj } from "../api/utils";

const createMulterMiddleware = () => {
	return multer({
		dest: path.join(process.cwd(), "/uploads"),
		limits: {
			fileSize: 10 * 1024 * 1024
		},
		fileFilter: (_, file, callback) => {
			const fileExt = path.extname(file.originalname);

			const isValidMimeTypes =
				file.mimetype == "image/png" ||
				file.mimetype == "image/jpg" ||
				file.mimetype == "image/jpeg";

			const isValidExtension = fileExt === ".png" || fileExt === ".jpg" || fileExt === ".jpeg";

			if (isValidMimeTypes && isValidExtension) {
				callback(null, true);
			} else {
				callback(null, false);
				return callback(new ErrorObj.ClientError("Only .png, .jpg and .jpeg format allowed!"));
			}
		}
	});
};

export default createMulterMiddleware();
