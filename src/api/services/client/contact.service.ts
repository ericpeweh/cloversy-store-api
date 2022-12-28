// Data
import { contactRepo } from "../../data/client";

// Types
import { CreateContactUsItem } from "../../interfaces";

export const createMessageWebForm = async (newMessage: CreateContactUsItem) => {
	await contactRepo.createMessageWebForm(newMessage);
};
