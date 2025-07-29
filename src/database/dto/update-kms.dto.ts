import { PartialType } from '@nestjs/mapped-types';
import { CreateKmsDto } from './create-kms.dto';

export class UpdateKmsDto extends PartialType(CreateKmsDto) { }
