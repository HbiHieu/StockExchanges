import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {StockEntity} from "./entities/stock.entity";
import {StockTransactionEntity} from "./entities/stock-transaction.entity";
import {CompanyEntity} from "./entities/company.entity";

@Module({
	imports: [
		TypeOrmModule.forFeature([
			StockEntity,
			StockTransactionEntity,
			CompanyEntity
		])
	],
	controllers: [StockController],
	providers: [StockService]
})
export class StockModule {}
