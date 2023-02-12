import {ApiResponseProperty} from "@nestjs/swagger";

export class BaseResponse {
	@ApiResponseProperty({
		type: Number,
		example: 200
	})
	readonly status: number;

	@ApiResponseProperty({
		type: String,
		example: 'success'
	})
	readonly message: string;

	@ApiResponseProperty({
		example: null
	})
	data: any;

	constructor({ status, message, data }: Partial<BaseResponse>) {
		this.status = status || 200;
		this.message = message || 'success';
		this.data = data || null;
	}
}
