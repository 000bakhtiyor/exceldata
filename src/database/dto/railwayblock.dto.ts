import { Type } from "class-transformer";
import { ValidateNested, IsArray } from "class-validator";
import { CreateKmsDto } from "./create-kms.dto";
import { CreateKmCordinateDto } from "./create-km-cordinates.dto";

export class RailwayBlockDto {
    @ValidateNested()
    @Type(() => CreateKmsDto)
    km: CreateKmsDto;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateKmCordinateDto)
    km_coordinates: CreateKmCordinateDto[];
}