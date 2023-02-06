import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Stock - API')
@Controller('stock')
export class StockController {}
