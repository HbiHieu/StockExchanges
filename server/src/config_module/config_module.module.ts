import { Module } from '@nestjs/common';
import { ConfigServiceProvider } from './config_module.service';
import { CONFIG_SERVICE } from '../constanst';

@Module({
	providers: [
		{
			provide: CONFIG_SERVICE,
			useClass: ConfigServiceProvider
		},
		ConfigServiceProvider
	],
	exports: [ConfigModuleModule, ConfigServiceProvider]
})
export class ConfigModuleModule {}
