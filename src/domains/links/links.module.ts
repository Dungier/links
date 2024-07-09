import {Module} from '@nestjs/common';
import {PrismaService} from '../../../prisma/services/prisma.service';
import LinksService from './services/links.service';
import RedisModule from '../../../redis/redis.module';
import PrismaModule from '../../../prisma/prisma.module';
import LinksController from '../../controllers/links.controller';

@Module({
    imports: [
        RedisModule,
        PrismaModule,
    ],
    controllers: [LinksController],
    providers: [PrismaService, LinksService]
})

export default class LinksModule {}