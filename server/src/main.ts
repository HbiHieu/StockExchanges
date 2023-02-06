import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpStatus, Logger, ValidationError, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExceptionResponse } from './utils/utils.exception';
import { UtilCommonTemplate } from './utils/utils.common';
import { ValidationFilter } from './filters/validation.filter';

async function bootstrap() {
	const logger = new Logger('AppLogger');
	const app = await NestFactory.create<NestExpressApplication>(AppModule, { bodyParser: true });
	app.setGlobalPrefix(process.env.API_PREFIX);

	const config = new DocumentBuilder()
		.addBearerAuth()
		.setTitle('Stock Exchanges')
		.setDescription('Stock API - Talented Investor')
		.setVersion('1.0')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('docs', app, document, { customSiteTitle: 'Stock Swagger' });

	app.useGlobalFilters(new ValidationFilter());
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			exceptionFactory(errors: ValidationError[]) {
				logger.error(errors);
				return new ExceptionResponse(HttpStatus.BAD_REQUEST, UtilCommonTemplate.getMessageValidator(errors));
			}
		})
	);

	app.useStaticAssets(join(__dirname, '..', 'public'));
	await app.listen(process.env.SERVER_PORT).then(() => {
		console.log(`Server is running at ${process.env.SERVER_PORT}`);
	});
}

bootstrap();
