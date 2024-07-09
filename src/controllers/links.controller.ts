import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import LinksService from '../domains/links/services/links.service';
import LinkCreateRequestDto from '../domains/links/dto/request/link-create-request.dto';
import GetValueResponseDto from '../domains/links/dto/response/get-value-response.dto';
import CreateLinkResponseDto from '../domains/links/dto/response/create-link-response.dto';

@Controller('links')
export default class LinksController {
    constructor(private readonly linkService: LinksService) {
    }

    @Post('/create')
    public async createLink(@Body() dto: LinkCreateRequestDto): Promise<CreateLinkResponseDto> {
        return this.linkService.createLink(dto);
    }

    @Get('/value/:token')
    public async getValue(@Param('token') token: string): Promise<GetValueResponseDto> {
        return this.linkService.getValue(token);
    }
}