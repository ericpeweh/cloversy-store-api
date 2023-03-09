class ErrorBase extends Error {
	code: number;

	constructor(
		message: string = "Something went wrong!",
		code: number,
		options: { [key: string]: any } = {}
	) {
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
	constructor(message: string, code: number = 400, options?: { [key: string]: any }) {
		super(message, code, options);
		this.name = "ClientError";
	}
}

export class ServerError extends ErrorBase {
	constructor(message: string, code: number = 500, options?: { [key: string]: any }) {
		super(message, code, options);
		this.name = "ServerError";
	}
}
