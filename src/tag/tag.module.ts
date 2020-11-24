import { forwardRef, Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { PhotoModule } from 'src/photo/photo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tag]),
    forwardRef(() => PhotoModule)
  ],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService]
})
export class TagModule {}
