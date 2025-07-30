import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class CreateKmCordinateDto {
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
}
