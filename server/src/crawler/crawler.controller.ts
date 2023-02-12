import {Controller, Get, HttpStatus, Query, Res} from '@nestjs/common';
import {CrawlerService} from './crawler.service';
import {ApiTags} from '@nestjs/swagger';
import {BaseResponse} from "../utils/utils.response";

@ApiTags('Craw - API')
@Controller('crawler')
export class CrawlerController {
	constructor(private readonly crawlerService: CrawlerService) {}

	@Get('')
	async getCraw(@Query() q: any) {
		return this.crawlerService.getCraw(q.stock_exchanges);
	}

	@Get('generate-stock-data')
	async generateStockOscillation(@Query() q: any, @Res() res: any) {
		const data = await this.crawlerService.generateStockOscillation(q.symbol, +q.initial_price, +q.start_time, +q.num_prices);
		return res.status(HttpStatus.OK).send(new BaseResponse({ data }))
	}

	@Get('craw-industry')
	async crawIndustry(@Query() q: any, @Res() res: any) {
		const data = await this.crawlerService.crawData(q.stock_exchanges);
		return res.status(HttpStatus.OK).send(new BaseResponse({data}))
	}
}
