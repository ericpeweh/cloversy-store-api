// Dependencies
import { customAlphabet } from "nanoid";

const generateUniqueId = (digits?: number, alphabet?: string) => {
	if (digits === 0 || alphabet === "") return "";

	const digitsValue = digits || 10;
	const alphabetValue = alphabet || "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

	return customAlphabet(alphabetValue, digitsValue)();
};

export default generateUniqueId;
