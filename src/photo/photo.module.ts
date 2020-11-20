import { Module, forwardRef } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { PhotoController } from './photo.controller';
import { Photo } from './photo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumModule } from 'src/album/album.module';
import { FaceService } from 'src/face/face.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Photo]),
    forwardRef(() => AlbumModule)
  ],
  providers: [PhotoService],
  controllers: [PhotoController],
  exports: [PhotoService]
})
export class PhotoModule {}
