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
import { FacesTaged } from './people/facesTaged.entity';
import { FaceService } from './face/face.service';
import { FaceModule } from './face/face.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'dev',
      password: 'devplatform',
      database: 'foto',
      entities: [Album,Photo,Tag,People,FacesTaged],
      synchronize: true,
    //  logging: true,
    //  debug: true,
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
  ],
  controllers: [AppController],
  providers: [AppService, FaceService],
  exports: [FaceService],
})
export class AppModule {}
