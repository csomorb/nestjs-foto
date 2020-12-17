import { Module, forwardRef } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { PhotoController } from './photo.controller';
import { Photo } from './photo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumModule } from 'src/album/album.module';
import { FaceModule } from 'src/face/face.module';
import { TagModule } from 'src/tag/tag.module';
import { PeopleModule } from 'src/people/people.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    TypeOrmModule.forFeature([Photo]),
    forwardRef(() => AlbumModule),
    forwardRef(() => TagModule),
    forwardRef(() => PeopleModule),
    forwardRef(() => FaceModule) 
  ],
  providers: [PhotoService],
  controllers: [PhotoController],
  exports: [PhotoService]
})
export class PhotoModule {}
