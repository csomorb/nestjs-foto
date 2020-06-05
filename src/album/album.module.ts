import { Module, forwardRef } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { Album } from './album.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoModule } from 'src/photo/photo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Album]),
    forwardRef(() => PhotoModule)
  ],
  providers: [AlbumService],
  controllers: [AlbumController],
  exports: [AlbumService]
})
export class AlbumModule {}
