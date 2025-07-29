import { Module } from '@nestjs/common';
import { UploadController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KmCordinates, Kms } from './database/entities/database.entity';
import { DatabaseService } from './database/database.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Kms, KmCordinates]),
    DatabaseModule,

    TypeOrmModule.forRoot({
      type: 'postgres',
      host:'localhost',
      port:5432,
      username:'magama',
      password:'testpassword',
      database:'todo',
      entities: [Kms, KmCordinates], 
      synchronize: true,
    })
  ],
  controllers: [UploadController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
