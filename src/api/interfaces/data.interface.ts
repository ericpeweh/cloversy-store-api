export interface RajaOngkirResponse<T> {
	rajaongkir: {
		status: {
			code: number;
			description: string;
		};
		results: T[];
	};
}

export type CourierCode = "jne" | "sicepat" | "jnt";

export type RajaOngkirCostResponse = RajaOngkirResponse<{
	code: string;
	name: string;
	costs: ShippingService[];
}>;

export interface ShippingManifestItem {
	manifest_code: string;
	manifest_description: string;
	manifest_date: string;
	manifest_time: string;
	city_name: string;
}

export interface RajaOngkirWaybillResponse {
	rajaongkir: {
		status: {
			code: number;
			description: string;
		};
		result: {
			delivered: boolean;
			manifest: ShippingManifestItem[];
		};
	};
}

export interface ShippingService {
	service: string;
	description: string;
	cost: ShippingCost[];
}

export interface ShippingCost {
	value: number;
	etd: string;
	note: string;
}

export interface CostItem extends ShippingCost {
	courier: string;
	service: string;
	description: string;
}
