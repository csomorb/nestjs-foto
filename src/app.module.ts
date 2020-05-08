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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'dev',
      password: 'devplatform',
      database: 'foto',
      entities: [Album,Photo,Tag,People],
      synchronize: true,
    //  logging: true,
    //  debug: true,
    }),
    MulterModule.register({
      dest: './fotos',
    }),
    AlbumModule,
    PhotoModule,
    TagModule,
    PeopleModule,
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
