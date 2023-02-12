import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ConfigModuleModule } from './config_module/config_module.module';
import { CrawlerModule } from './crawler/crawler.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigServiceProvider } from './config_module/config_module.service';
import {SignVerifyMiddleware} from "./middlewares/sign-verify.middleware";
import {StockModule} from "./stock/stock.module";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModuleModule],
			useFactory: (config: ConfigServiceProvider) => config.createTypeOrmOptions(),
			inject: [ConfigServiceProvider]
		}),
		ConfigModuleModule,
		CrawlerModule,
		StockModule
	],
	providers: [AppService]
})

// export class AppModule implements NestModule {
// 	configure(consumer: MiddlewareConsumer): any {
// 		consumer.apply(SignVerifyMiddleware).forRoutes('*')
// 	}
// }

export class AppModule {}
