import { HttpStatus, Injectable } from '@nestjs/common';
import { NestCrawlerService } from 'nest-crawler';
import { CatchException, ExceptionResponse } from '../utils/utils.exception';
import * as cheerio from 'cheerio';
import { HttpService } from '@nestjs/axios';
import { convertToNumber } from '../utils/utils.common';
import { InjectPage } from 'nest-puppeteer';
import type { Page } from 'puppeteer';
import { InjectRepository } from '@nestjs/typeorm';
import { StockEntity } from '../stock/entities/stock.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CrawlerService {
	constructor(
		private readonly crawler: NestCrawlerService,
		private readonly http: HttpService,
		@InjectRepository(StockEntity)
		private readonly stock: Repository<StockEntity>,
		@InjectPage()
		private readonly page: Page
	) {}

	async getHTML(url: string): Promise<string> {
		return await new Promise((resolve, reject) => {
			this.http.get(url, { headers: { 'Accept-Encoding': '*' } }).subscribe(
				(res) => {
					if (res.status === HttpStatus.OK) {
						resolve(res.data);
					}
					reject(res.data);
				},
				(err) => {
					console.log(err);
					reject(new ExceptionResponse(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error', process.env.USER_SERVICE));
				}
			);
		});
	}

	generateStockData(initial_price: number, start_time: number, num_prices: number) {
		const prices = [];
		let previousPrice = initial_price;
		let currentTime = start_time;
		let endTime;
		let openPrice = previousPrice;
		let closePrice;
		for (let i = 0; i < num_prices; i++) {
			let randomChange = Math.round((Math.random() * 2 - 1) * previousPrice * 0.03);
			let price = previousPrice + randomChange;
			closePrice = price;
			let highestPrice = Math.round(Math.min(openPrice * 1.03, price + (price - openPrice) * Math.random()));
			let lowestPrice = Math.round(Math.max(openPrice * 0.97, price - (price - openPrice) * Math.random()));
			endTime = currentTime + (12 * 60 * 60 * 1000);
			prices.push({
				open_price: openPrice,
				close_price: closePrice,
				highest_price: highestPrice,
				lowest_price: lowestPrice,
				start_time: currentTime,
				end_time: endTime
			});
			previousPrice = price;
			openPrice = price;
			currentTime = endTime + (12 * 60 * 60 * 1000);
		}
		return prices;
	}


	async getCraw(stock_exchanges: string): Promise<any> {
		try {
			await this.page.goto(`https://trade.vndirect.com.vn/chung-khoan/${stock_exchanges}`, {
				waitUntil: 'networkidle2'
			});
			const html = await this.page.content();

			const data: any = [];

			const $ = cheerio.load(html);
			$('#banggia-khop-lenh tbody tr').each(function () {
				const symbol = $(this).attr('id');
				const company_name = $(this).find('td:first-child').attr('data-tooltip').trim();
				const original_price = convertToNumber($(this).find('td:nth-child(2) > span').text());
				const highest_price = convertToNumber($(this).find('td:nth-child(3) > span').text());
				const lowest_price = convertToNumber($(this).find('td:nth-child(4) > span').text());
				const latest_price = convertToNumber($(this).find('td:nth-child(4) > span').text());
				const volume = convertToNumber($(this).find('td:nth-child(5) > span:first-child > span').text());
				const value = convertToNumber($(this).find('td:nth-child(5) > span:last-child > span').text());
				const buy = convertToNumber($(this).find('td:last-child > span:first-child > span:first-child').text());
				const sell = convertToNumber($(this).find('td:last-child > span:first-child > span:last-child').text());
				const residual = convertToNumber($(this).find('td:last-child > span:last-child > span').text());

				data.push({
					stock_exchanges: stock_exchanges.toUpperCase(),
					symbol,
					company_name,
					volume,
					value,
					original_price,
					highest_price,
					lowest_price,
					latest_price,
					foreign_investment: {
						buy,
						sell,
						residual
					}
				});
			});

			for await (const item of data) {
				await this.stock
					.create({
						stock_exchanges: item.stock_exchanges,
						company_name: item.company_name,
						symbol: item.symbol,
						trading_volume: item.volume,
						trading_value: item.value,
						foreign_investment_buy: item.foreign_investment.buy,
						foreign_investment_sell: item.foreign_investment.sell,
						foreign_investment_residual: item.foreign_investment.residual,
						original_price: item.original_price,
						highest_price: item.highest_price,
						lowest_price: item.lowest_price
					})
					.save();
			}

			return data;
		} catch (e) {
			throw new CatchException(e);
		}
	}

	async generateStockOscillation(symbol: string, initial_price: number, start_time: number, num_prices: number) : Promise<any> {
		return {
			meta: {
				company_name: 'Công ty ABC',
				symbol,
			},
			detailed_data: this.generateStockData(initial_price, start_time, num_prices)
		}
	}

	async crawData(stock_exchanges: string): Promise<any> {
		try {
			await this.page.goto(`https://trade.vndirect.com.vn/chung-khoan/${stock_exchanges}`, {
				waitUntil: 'networkidle2'
			});
			const html = await this.page.content();

			const data: any = [];

			const $ = cheerio.load(html);
			$('.banggia-co-ban-body tbody tr').each(function () {
				console.log(this)
				const symbol = $(this).attr('id');
				console.log(symbol)
			})

		} catch (e) {
			throw new CatchException(e)
		}


	}
}
