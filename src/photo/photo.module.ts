import { Module } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { PhotoController } from './photo.controller';
import { Photo } from './photo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumModule } from 'src/album/album.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Photo]),
    AlbumModule
  ],
  providers: [PhotoService],
  controllers: [PhotoController],
  exports: [PhotoService]
})
export class PhotoModule {}
