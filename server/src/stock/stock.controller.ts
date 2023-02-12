import {Controller, Get, HttpStatus, Query, Res} from '@nestjs/common';
import {ApiResponse, ApiTags} from '@nestjs/swagger';
import {StockService} from "./stock.service";
import {BaseResponse} from "../utils/utils.response";
import {Response} from "express";
import {GenerateVolatilityQuery} from "./dto/generate-volatility-query";
import {GenerateVolatilityResponse} from "../responses/generate-volatility-response";

@ApiTags('Stock - API')
@Controller('stock')
export class StockController {
    constructor(
        private readonly stockService: StockService,
    ) {
    }

    @ApiResponse({type: GenerateVolatilityResponse})
    @Get('generate-volatility-data')
    async generateVolatilityData(@Query() q: GenerateVolatilityQuery, @Res() res: Response) {
        const data = await this.stockService.generateVolatility(
            q.symbol.toUpperCase(),
            parseInt(q.start_time),
            parseInt(q.quantity)
        );

        return res.status(HttpStatus.OK).send(new BaseResponse({data}))
    }

}
