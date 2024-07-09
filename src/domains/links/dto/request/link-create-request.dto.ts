import {IsString} from 'class-validator';

export default class LinkCreateRequestDto {
    @IsString()
    public value: string;
}