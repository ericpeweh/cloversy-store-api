export interface ContactUsItem {
	id: number;
	senderName: string;
	email: string;
	objective: string;
	title: string;
	message: string;
	created_at: string;
}

export type CreateContactUsItem = Omit<ContactUsItem, "id" | "created_at">;
