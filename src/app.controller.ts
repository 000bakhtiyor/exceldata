import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AppService, RailwayBlock } from './app.service';

@Controller('upload')
@ApiTags('Upload')
export class UploadController {
  constructor(private readonly appService: AppService) { }

  @Post('railway')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          cb(null, `railway-${Date.now()}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(xlsx)$/)) {
          return cb(
            new BadRequestException('Only .xlsx files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  @ApiOperation({ summary: 'Upload Railway Excel (.xlsx) and parse it' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Parsed railway data returned successfully',
    schema: {
      example: {
        railwayData: [
          {
            blockId: 'BLOCK_001',
            start: 'Point A',
            end: 'Point B',
            distance: 12.3,
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Only .xlsx files are allowed',
  })
  async parseRailwayExcel(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ railwayData: RailwayBlock[] }> {
    return this.appService.getRailWayData(file);
  }
}
