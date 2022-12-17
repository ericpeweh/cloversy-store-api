export interface RajaOngkirResponse<T> {
	rajaongkir: {
		status: {
			code: number;
			description: string;
		};
		results: T[];
	};
}

export type RajaOngkirCostResponse = RajaOngkirResponse<{
	code: string;
	name: string;
	costs: ShippingService[];
}>;

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
