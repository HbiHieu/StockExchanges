import { ApiResponseProperty } from '@nestjs/swagger';

export class ExampleResponse {
	@ApiResponseProperty({
		type: Number,
		example: 1
	})
	variable: number;

	constructor(data?: ExampleResponse) {
		this.variable = data?.variable ?? 0;
	}

	public mapToList(data?: ExampleResponse[]) {
		return data.map((item: ExampleResponse) => new ExampleResponse(item));
	}
}
