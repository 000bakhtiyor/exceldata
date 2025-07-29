import {
    IsNumber,
    IsNotEmpty,
    // ValidateNested,
    // IsArray,
    // ArrayMinSize,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateKmsDto {
    @ApiProperty({
        description: 'Kilometer value',
        example: 102.5,
        type: Number,
    })
    @IsNumber()
    @IsNotEmpty()
    km: number;

    @ApiProperty({
        description: 'Latitude of the coordinate',
        example: 27.1751,
        type: Number,
    })
    @IsNumber()
    @IsNotEmpty()
    latitude: number;

    @ApiProperty({
        description: 'Longitude of the coordinate',
        example: 78.0421,
        type: Number,
    })
    @IsNumber()
    @IsNotEmpty()
    longitude: number;

    @ApiProperty({
        description: 'Associated Line ID',
        example: 1.0,
        type: Number,
    })
    @IsNumber()
    @IsNotEmpty()
    lineId: number;
}


    // @IsArray()
    // @ArrayMinSize(1)
    // @ValidateNested({ each: true })
    // @Type(() => CreateKmCordinateDto)
    // cordinates: CreateKmCordinateDto[];

