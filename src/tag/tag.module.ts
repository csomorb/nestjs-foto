import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { PhotoModule } from 'src/photo/photo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tag]),
    PhotoModule
  ],
  controllers: [TagController],
  providers: [TagService]
})
export class TagModule {}
