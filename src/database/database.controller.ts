import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

import { DatabaseService } from './database.service';

import { CreateKmsDto } from './dto/create-kms.dto';
import { UpdateKmsDto } from './dto/update-kms.dto';
import { CreateKmCordinateDto } from './dto/create-km-cordinates.dto';
import { UpdateKmCordinateDto } from './dto/update-kms-cordinates.dto';

@ApiTags('Database')
@Controller('track')
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) { }

  // --- KMS Endpoints ---

  @Post('kms')
  @ApiOperation({ summary: 'Create a KMS entry' })
  @ApiBody({ type: CreateKmsDto })
  @ApiResponse({ status: 201, description: 'KMS created successfully' })
  createKms(@Body() dto: CreateKmsDto) {
    return this.databaseService.createKms(dto);
  }

  @Get('kms')
  @ApiOperation({ summary: 'Get all KMS entries' })
  @ApiResponse({ status: 200, description: 'List of all KMS entries' })
  findAllKms() {
    return this.databaseService.findAllKms();
  }

  @Get('km/:id')
  @ApiOperation({ summary: 'Get a single KMS entry' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'KMS entry found' })
  findOneKms(@Param('id', ParseIntPipe) id: number) {
    return this.databaseService.findOneKms(id);
  }

  @Patch('km/:id')
  @ApiOperation({ summary: 'Update a KMS entry' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: CreateKmsDto })
  @ApiResponse({ status: 200, description: 'KMS entry updated' })
  updateKms(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateKmsDto,
  ) {
    return this.databaseService.updateKms(id, dto);
  }

  @Delete('kms/:id')
  @ApiOperation({ summary: 'Delete a KMS entry' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'KMS entry deleted' })
  removeKms(@Param('id', ParseIntPipe) id: number) {
    return this.databaseService.removeKms(id);
  }

  // --- KmCordinates Endpoints ---

  @Post('km/:id/cordinates')
  @ApiOperation({ summary: 'Create KmCordinates entry' })
  @ApiBody({ type: CreateKmCordinateDto })
  @ApiResponse({ status: 201, description: 'KmCordinate created successfully' })
  createCordinate(@Param() id:number ,@Body() dto: CreateKmCordinateDto) {
    return this.databaseService.createKmCordinates(id, dto);
  }


  @Get('cordinates/:id')
  @ApiOperation({ summary: 'Get a single KmCordinates entry' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'KmCordinates entry found' })
  findOneCordinate(@Param('id', ParseIntPipe) id: number) {
    return this.databaseService.findOneCordinate(id);
  }

  @Patch('cordinates/:id')
  @ApiOperation({ summary: 'Update a KmCordinates entry' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: CreateKmCordinateDto })
  @ApiResponse({ status: 200, description: 'KmCordinates entry updated' })
  updateCordinate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateKmCordinateDto,
  ) {
    return this.databaseService.updateCordinate(id, dto);
  }

  @Delete('cordinates/:id')
  @ApiOperation({ summary: 'Delete a KmCordinates entry' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'KmCordinates entry deleted' })
  removeCordinate(@Param('id', ParseIntPipe) id: number) {
    return this.databaseService.removeCordinate(id);
  }
}
