import {HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {StockEntity} from "./entities/stock.entity";
import {Repository} from "typeorm";
import {CatchException, ExceptionResponse} from "../utils/utils.exception";
import {DetailedData, GenerateVolatilityResponse} from "../responses/generate-volatility-response";

@Injectable()
export class StockService {
    constructor(
        @InjectRepository(StockEntity)
        private readonly stockRepo: Repository<StockEntity>,
    ) {
    }

    private generateStockData(initial_price: number, start_time: number, quantity: number): DetailedData[] {
        const prices = [];
        let previousPrice = initial_price;
        let currentTime = start_time;
        let endTime;
        let openPrice = previousPrice;
        let closePrice;
        for (let i = 0; i < quantity; i++) {
            let randomChange = Math.round((Math.random() * 2 - 1) * previousPrice * parseInt(process.env.VOLATILITY) / 100);
            let price = previousPrice + randomChange;
            closePrice = price;
            let highestPrice = Math.round(Math.min(openPrice * (1 + parseInt(process.env.VOLATILITY) / 100), price + (price - openPrice) * Math.random()));
            let lowestPrice = Math.round(Math.max(openPrice * (1 - parseInt(process.env.VOLATILITY) / 100), price - (price - openPrice) * Math.random()));
            endTime = currentTime + (12 * 60 * 60 * 1000);

            // Ensure that highest_price is always greater than lowest_price
            if (highestPrice < lowestPrice) {
                [highestPrice, lowestPrice] = [lowestPrice, highestPrice];
            }

            // Ensure that lowest_price is always smaller than the other prices
            if (lowestPrice > openPrice || lowestPrice > closePrice) {
                lowestPrice = Math.min(openPrice, closePrice);
            }

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

    async generateVolatility(symbol: string, start_time: number, quantity: number) {
        try {
            const stock: StockEntity = await this.stockRepo.findOneBy({symbol});
            if (!stock) throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'symbol not found!');

            const volatility: DetailedData[] = this.generateStockData(stock.original_price, start_time, quantity);
            return new GenerateVolatilityResponse({...stock, volatility})
        } catch (e) {
            throw new CatchException(e)
        }
    }
}
