import {ApiProperty, ApiResponseProperty, PartialType} from "@nestjs/swagger";
import {BaseResponse} from "../utils/utils.response";
import {UtilCommonTemplate} from "../utils/utils.common";

export class MetaResponse {
    @ApiResponseProperty({
        type: String,
        example: 'Công ty ABC'
    })
    company_name: string;

    @ApiResponseProperty({
        type: String,
        example: 'ABC'
    })
    symbol: string;

    constructor(data?: any) {
        this.company_name = data?.company_name ?? "";
        this.symbol = data?.symbol ?? "";
    }
}

export class DetailedData {
    @ApiResponseProperty({
        type: Number,
        example: 25.01
    })
    open_price: number;

    @ApiResponseProperty({
        type: Number,
        example: 25.41
    })
    close_price: number;

    @ApiResponseProperty({
        type: Number,
        example: 26.01
    })
    highest_price: number;

    @ApiResponseProperty({
        type: Number,
        example: 24.91
    })
    lowest_price: number;

    @ApiResponseProperty({
        type: Date,
        example: "01-01-2015 00:00:00"
    })
    start_time: Date | string;

    @ApiResponseProperty({
        type: Date,
        example: "01-01-2015 12:00:00"
    })
    end_time: Date | string;

    constructor(data?: any) {
        this.open_price = +(data?.open_price / 1000).toFixed(2) ?? 0;
        this.close_price = +(data?.close_price / 1000).toFixed(2) ?? 0;
        this.highest_price = +(data?.highest_price / 1000).toFixed(2) ?? 0;
        this.lowest_price = +(data?.lowest_price / 1000).toFixed(2) ?? 0;
        this.start_time = UtilCommonTemplate.toDateTime(data?.start_time) ?? "";
        this.end_time = UtilCommonTemplate.toDateTime(data?.end_time) ?? "";
    }

    public mapToList(data?: any) {
        return data.map((item: DetailedData) => new DetailedData(item));
    }

}

class Data {
    @ApiProperty({
        type: MetaResponse,
        example: MetaResponse
    })
    meta: MetaResponse;

    @ApiProperty({
        type: DetailedData,
        example: DetailedData,
        isArray: true
    })
    detailed_data: DetailedData;
}

export class GenerateVolatilityResponse extends PartialType(BaseResponse) {
    meta: MetaResponse;
    detailed_data: DetailedData[];

    @ApiProperty({
        type: Data,
        example: Data
    })
    data?: Data;

    constructor(data?: any) {
        super();
        this.meta = new MetaResponse(data);
        this.detailed_data = new DetailedData().mapToList(data?.volatility)
    }
}
