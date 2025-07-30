import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Kms, KmCordinates } from './entities/database.entity';

import { CreateKmsDto } from './dto/create-kms.dto';
import { UpdateKmsDto } from './dto/update-kms.dto';
import { CreateKmCordinateDto } from './dto/create-km-cordinates.dto';
import { UpdateKmCordinateDto } from './dto/update-kms-cordinates.dto';

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { validate as isUUID } from 'uuid'; // Native uuid validator
import { RailwayBlock } from 'src/app.service';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(Kms)
    private readonly kmsRepository: Repository<Kms>,

    @InjectRepository(KmCordinates)
    private readonly cordinatesRepository: Repository<KmCordinates>,

  ) { }

  async createKms(dto: CreateKmsDto): Promise<Kms> {
    const newKm = this.kmsRepository.create(dto);
    return await this.kmsRepository.save(newKm);
  }

async saveRailwayDataToDb(railwayData: RailwayBlock[], lineId?: number): Promise < void> {
  for(const block of railwayData) {
    const { km, km_coordinates } = block;

    const createKmsDto: CreateKmsDto = {
      km: km.km,
      latitude: km.latitude,
      longitude: km.longitude,
      lineId: lineId || 1, 
    };

    const savedKms = await this.createKms(createKmsDto);

    for (const coord of km_coordinates) {
      const createCoordDto: CreateKmCordinateDto = {
        latitude: coord.latitude,
        longitude: coord.longitude,
      };

      await this.createKmCordinates(savedKms.id,createCoordDto);
    }
  }
}

  async findAllKms(): Promise<Kms[]> {
    return this.kmsRepository.find();
  }

  async findOneKms(id: number): Promise<Kms> {
    const entity = await this.kmsRepository.findOne({
      where: {id},
      relations: ['cordinates']
    });
    if (!entity) throw new NotFoundException(`Kms with id ${id} not found`);
    return entity;
  }

  async updateKms(id: number, dto: UpdateKmsDto): Promise<Kms> {
    const kms = await this.findOneKms(id);
    Object.assign(kms, dto)
    return await this.kmsRepository.save(kms);
  }

  async removeKms(id: number): Promise<void> {
    const kms = await this.findOneKms(id);
    await this.kmsRepository.remove(kms);
  }



async createKmCordinates(kmId: number ,dto: CreateKmCordinateDto): Promise <KmCordinates> {

  if (!kmId) {
    throw new NotFoundException('KmsId is required');
  }

  const existingKms = await this.kmsRepository.findOne({
    where: { id: kmId },
  });

  if (!existingKms) {
    throw new NotFoundException(`Km not found for id: ${kmId}`);
  }

  const newCoordinate = this.cordinatesRepository.create({
    ...dto,
    kms: existingKms, 
  });

  return await this.cordinatesRepository.save(newCoordinate);
}


  async findOneCordinate(id: number): Promise<KmCordinates> {
    const cord = await this.cordinatesRepository.findOne({ 
      where: {id},
      relations: ['kms']
     });
    if (!cord) throw new NotFoundException(`Coordinate with id ${id} not found`);
    return cord;
  }

  async updateCordinate(id: number, dto: UpdateKmCordinateDto): Promise<KmCordinates> {
    const cord = await this.findOneCordinate(id);
    Object.assign(cord, dto)
    return await this.cordinatesRepository.save(cord);
  }

  async removeCordinate(id: number): Promise<void> {
    const cord = await this.findOneCordinate(id);
    await this.cordinatesRepository.remove(cord);
  }
}
