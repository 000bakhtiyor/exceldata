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
        KmsId: savedKms.id,
      };

      await this.createKmCordinates(createCoordDto);
    }
  }
}

  async findAllKms(): Promise<Kms[]> {
    return this.kmsRepository.find({
      relations: ['cordinates']
    });
  }

  async findOneKms(id: string): Promise<Kms> {
    const entity = await this.kmsRepository.findOneBy({ id });
    if (!entity) throw new NotFoundException(`Kms with id ${id} not found`);
    return entity;
  }

  async updateKms(id: string, dto: UpdateKmsDto): Promise<Kms> {
    const kms = await this.findOneKms(id);
    const updated = this.kmsRepository.merge(kms, dto);
    return await this.kmsRepository.save(updated);
  }

  async removeKms(id: string): Promise<void> {
    const kms = await this.findOneKms(id);
    await this.kmsRepository.remove(kms);
  }



async createKmCordinates(dto: CreateKmCordinateDto): Promise < KmCordinates > {
  const { KmsId } = dto;

  if(!KmsId) {
    throw new NotFoundException('KmsId is required');
  }

  if(!isUUID(KmsId)) {
    throw new BadRequestException('KmsId must be a valid UUID');
  }

  const existingKms = await this.kmsRepository.findOne({
    where: { id: KmsId },
  });

  if (!existingKms) {
    throw new NotFoundException(`Kms not found for id: ${KmsId}`);
  }

  const newCoordinate = this.cordinatesRepository.create({
    ...dto,
    kms: existingKms, 
  });

  return await this.cordinatesRepository.save(newCoordinate);
}


  async findAllCordinates(): Promise<KmCordinates[]> {
    return this.cordinatesRepository.find({
      relations: ['kms']
    });
  }

  async findOneCordinate(id: string): Promise<KmCordinates> {
    const cord = await this.cordinatesRepository.findOne({ 
      where: {id},
      relations: ['kms']
     });
    if (!cord) throw new NotFoundException(`Coordinate with id ${id} not found`);
    return cord;
  }

  async updateCordinate(id: string, dto: UpdateKmCordinateDto): Promise<KmCordinates> {
    const cord = await this.findOneCordinate(id);
    const updated = this.cordinatesRepository.merge(cord, dto);
    return await this.cordinatesRepository.save(updated);
  }

  async removeCordinate(id: string): Promise<void> {
    const cord = await this.findOneCordinate(id);
    await this.cordinatesRepository.remove(cord);
  }
}
