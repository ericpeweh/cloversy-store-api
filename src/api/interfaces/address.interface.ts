export interface Address {
	id: number;
	recipient_name: string;
	contact: string;
	address: string;
	is_default: boolean;
	province: string;
	province_id: number;
	city: string;
	city_id: number;
	subdistrict: string;
	subdistrict_id: number;
	postal_code: string;
	label: string;
	shipping_note: string;
}

export interface UpdateAddressDataArgs {
	updatedAddressData: Partial<Address>;
	addressId: string;
	userId: string;
}
