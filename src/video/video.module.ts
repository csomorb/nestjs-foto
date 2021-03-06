import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumModule } from 'src/album/album.module';
import { FaceModule } from 'src/face/face.module';
import { PeopleModule } from 'src/people/people.module';
import { TagModule } from 'src/tag/tag.module';
import { VideoController } from './video.controller';
import { Video } from './video.entity';
import { VideoService } from './video.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Video]),
    forwardRef(() => AlbumModule),
    forwardRef(() => TagModule),
    forwardRef(() => PeopleModule),
    forwardRef(() => FaceModule) 
  ],
  controllers: [VideoController],
  providers: [VideoService],
  exports: [VideoService]
})
export class VideoModule {}
