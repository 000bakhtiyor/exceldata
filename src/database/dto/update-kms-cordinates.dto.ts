import { PartialType } from '@nestjs/mapped-types';
import { CreateKmCordinateDto } from './create-km-cordinates.dto';

export class UpdateKmCordinateDto extends PartialType(CreateKmCordinateDto) { }
