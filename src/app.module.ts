import { Module } from "@nestjs/common";
import RedisModule from '../redis/redis.module';
import PrismaModule from '../prisma/prisma.module';
import LinksModule from './domains/links/links.module';

@Module({
  imports: [
      RedisModule,
      PrismaModule,
      LinksModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
