import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlbumModule } from './album/album.module';
import { Album } from './album/album.entity';
import { FotoModule } from './foto/foto.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'dev',
      password: 'devplatform',
      database: 'foto',
      entities: [Album],
      synchronize: true,
      logging: true,
      debug: true,
    }),
    AlbumModule,
    FotoModule,
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
