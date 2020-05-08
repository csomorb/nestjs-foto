import { Module } from '@nestjs/common';
import { FotoService } from './foto.service';
import { FotoController } from './foto.controller';
import { Foto } from './foto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumModule } from 'src/album/album.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Foto]),
    AlbumModule
  ],
  providers: [FotoService],
  controllers: [FotoController],
  exports: [FotoService]
})
export class FotoModule {}
