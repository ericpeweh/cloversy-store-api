// Dependencies
import { customAlphabet } from "nanoid";

const generateUniqueId = (
	digits: number = 10,
	alphabet: string = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
) => {
	return customAlphabet(alphabet, digits)();
};

export default generateUniqueId;
