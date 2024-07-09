import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-ioredis';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        CacheModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                store: redisStore,
                host: configService.get<string>('REDIS_HOST', process.env.REDIS_HOST),
                port: configService.get<number>('REDIS_PORT', Number(process.env.REDIS_PORT)),
                ttl: 43200,
            }),
            isGlobal: true,
        }),
    ],
    exports: [ConfigModule, CacheModule],
})
export default class RedisModule {}
