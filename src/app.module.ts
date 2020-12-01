import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlbumModule } from './album/album.module';
import { Album } from './album/album.entity';
import { Photo } from './photo/photo.entity';
import { TagModule } from './tag/tag.module';
import { PeopleModule } from './people/people.module';
import { Tag } from './tag/tag.entity';
import { People } from './people/people.entity';
import { MulterModule } from '@nestjs/platform-express';
import { PhotoModule } from './photo/photo.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Face } from './face/face.entity';
import { FaceModule } from './face/face.module';
import { VideoModule } from './video/video.module';
import { Video } from './video/video.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'dev',
      password: 'devplatform',
      database: 'foto',
      entities: [Album,Photo,Tag,People,Face,Video],
      synchronize: true,
      // logging: true,
      // debug: true,
    }),
    MulterModule.register({
      dest: './fotos',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'files'),
    }),
    AlbumModule,
    PhotoModule,
    TagModule,
    PeopleModule,
    FaceModule,
    VideoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
