import {Inject, Injectable, Logger, NotFoundException} from '@nestjs/common';
import {PrismaService} from '../../../../prisma/services/prisma.service';
import CreateLinkResponseDto from '../dto/response/create-link-response.dto';
import GetValueResponseDto from '../dto/response/get-value-response.dto';
import LinkCreateRequestDto from '../dto/request/link-create-request.dto';
import {CACHE_MANAGER} from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {LinkInterface} from '../interfaces/link.interface';

@Injectable()
export default class LinksService {
    private readonly logger = new Logger(LinksService.name);

    constructor(
        private readonly prismaService: PrismaService,
        @Inject(CACHE_MANAGER) private readonly redisCache: Cache,
    ) {}

    public async createLink(dto: LinkCreateRequestDto): Promise<CreateLinkResponseDto> {
        const token = Date.now() / 1e3;

        const isExisting = await this.existingLink(token);

        if (isExisting) {
            this.logger.error(`Token ${token} already exists`);
            throw new Error('URL already exists');
        }

        const newLink = await this.prismaService.links.create({
            data: {
                token: token,
                value: dto.value,
                used: false,
            },
        });
        await this.redisCache.set(`token:${newLink.token}`, newLink);

        this.logger.log(`Created new link with token ${newLink.token}`);
        return { URL: `http://localhost:${process.env.PORT}/links/value/${newLink.token}` };
    }

    public async getValue(token: string): Promise<GetValueResponseDto> {
        const link = await this.existingLink(Number(token));

        if (!link || link.used) {
            this.logger.error(`Link with token ${token} not found or already used`);
            throw new NotFoundException('Link not found or already used');
        }

        await this.markLinkUsed(link);

        this.logger.log(`Retrieved value for token ${token}`);
        return { value: link.value };
    }

    private async existingLink(token: number): Promise<LinkInterface | null> {
        const tokenInCache = await this.redisCache.get<LinkInterface>(`token:${token}`);
        if (tokenInCache) {
            this.logger.log(`Token ${token} found in cache`);
            return tokenInCache;
        }

        const link = await this.prismaService.links.findUnique({
            where: { token },
        });

        if (link) {
            await this.redisCache.set(`token:${token}`, link);
            this.logger.log(`Token ${token} found in database and cached`);
        }

        return link;
    }

    private async markLinkUsed(link: LinkInterface): Promise<void> {
        const updatedLink = await this.prismaService.links.update({
            where: { token: link.token },
            data: { used: true },
        });

        await this.redisCache.set(`token:${updatedLink.token}`, updatedLink);
        this.logger.log(`Marked token ${link.token} as used`);
    }
}