import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { DatabaseService } from './database.service';

import { CreateKmsDto } from './dto/create-kms.dto';
import { UpdateKmsDto } from './dto/update-kms.dto';
import { CreateKmCordinateDto } from './dto/create-km-cordinates.dto';
import { UpdateKmCordinateDto } from './dto/update-kms-cordinates.dto';

@ApiTags('Database')
@Controller('database')
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) { }


  @Post('kms')
  @ApiOperation({ summary: 'Create a KMS entry' })
  @ApiResponse({ status: 201, description: 'KMS entry created' })
  createKms(@Body() dto: CreateKmsDto) {
    return this.databaseService.createKms(dto);
  }

  @Get('kms')
  @ApiOperation({ summary: 'Get all KMS entries' })
  findAllKms() {
    return this.databaseService.findAllKms();
  }

  @Get('kms/:id')
  @ApiOperation({ summary: 'Get a single KMS entry' })
  findOneKms(@Param('id') id: string) {
    return this.databaseService.findOneKms(id);
  }

  @Patch('kms/:id')
  @ApiOperation({ summary: 'Update a KMS entry' })
  updateKms(
    @Param('id') id: string,
    @Body() dto: UpdateKmsDto,
  ) {
    return this.databaseService.updateKms(id, dto);
  }

  @Delete('kms/:id')
  @ApiOperation({ summary: 'Delete a KMS entry' })
  removeKms(@Param('id') id: string) {
    return this.databaseService.removeKms(id);
  }


  @Post('cordinates')
  @ApiOperation({ summary: 'Create KmCordinates entry' })

  createCordinate(@Body() dto: CreateKmCordinateDto) {
    return this.databaseService.createKmCordinates(dto);
  }

  @Get('cordinates')
  @ApiOperation({ summary: 'Get all KmCordinates entries' })
  findAllCordinates() {
    return this.databaseService.findAllCordinates();
  }

  @Get('cordinates/:id')
  @ApiOperation({ summary: 'Get a single KmCordinates entry' })
  findOneCordinate(@Param('id') id: string) {
    return this.databaseService.findOneCordinate(id);
  }

  @Patch('cordinates/:id')
  @ApiOperation({ summary: 'Update a KmCordinates entry' })
  updateCordinate(
    @Param('id') id: string,
    @Body() dto: UpdateKmCordinateDto,
  ) {
    return this.databaseService.updateCordinate(id, dto);
  }

  @Delete('cordinates/:id')
  @ApiOperation({ summary: 'Delete a KmCordinates entry' })
  removeCordinate(@Param('id') id: string) {
    return this.databaseService.removeCordinate(id);
  }
}
