class ErrorBase extends Error {
	code: number;

	constructor(message: string, code: number, options: { [key: string]: any } = {}) {
		super(message);
		this.code = code;

		Object.entries(options).forEach(([key, value]) => {
			this[key as keyof Error] = value;
		});
	}

	get statusCode() {
		return this.code;
	}
}

export class ClientError extends ErrorBase {
	constructor(message?: string, code = 400, options?: { [key: string]: any }) {
		super(
			message ||
				"Something went wrong, make sure user is sending the correct input values, params, etc.",
			code,
			options
		);
		this.name = "ClientError";
	}
}

export class ServerError extends ErrorBase {
	constructor(_?: string, code = 500, options?: { [key: string]: any }) {
		super(
			"An error occured on our server, please try again later. If error persists, please contact us for more information.",
			code,
			options
		);
		this.name = "ServerError";
	}
}
