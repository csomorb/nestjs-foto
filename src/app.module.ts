import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlbumModule } from './album/album.module';
import { Album } from './album/album.entity';
import { FotoModule } from './foto/foto.module';
import { Foto } from './foto/foto.entity';
import { TagModule } from './tag/tag.module';
import { PeopleModule } from './people/people.module';
import { Tag } from './tag/tag.entity';
import { People } from './people/people.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'dev',
      password: 'devplatform',
      database: 'foto',
      entities: [Album,Foto,Tag,People],
      synchronize: true,
    //  logging: true,
    //  debug: true,
    }),
    MulterModule.register({
      dest: './fotos',
    }),
    AlbumModule,
    FotoModule,
    TagModule,
    PeopleModule,
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
