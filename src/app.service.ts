import { BadRequestException, Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { DatabaseService } from './database/database.service';

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface RailwayBlock {
  km: {
    km: number;
    latitude: number;
    longitude: number;
  };
  km_coordinates: Coordinate[];
}

@Injectable()
export class AppService {

  constructor(
    private databaseService: DatabaseService
  ){}
  async getRailWayData(file: Express.Multer.File): Promise<{ railwayData: RailwayBlock[]}> {
    if (!file) {
      throw new BadRequestException('File is missing');
    }

    const workbook = XLSX.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<any>(sheet);

    const normalized = rows.map(row => ({
      km: Number(row.__EMPTY),
      latitude: Number(row.__EMPTY_2),
      longitude: Number(row.__EMPTY_3),
    })).filter(r => r.km && !isNaN(r.latitude) && !isNaN(r.longitude));

    const grouped: Record<number, Coordinate[]> = {};
    for (const row of normalized) {
      if (!grouped[row.km]) grouped[row.km] = [];
      grouped[row.km].push({ latitude: row.latitude, longitude: row.longitude });
    }

    const railwayData: RailwayBlock[] = Object.entries(grouped)
      .filter(([_, coords]) => coords.length >= 0)
      .map(([km, coords]) => ({
        km: {
          km: Number(km),
          latitude: coords[0].latitude,
          longitude: coords[0].longitude,
        },
        km_coordinates: coords,
      }));
    
    this.databaseService.saveRailwayDataToDb(railwayData)
    fs.unlinkSync(file.path);

    return { railwayData } ;
  }

}
