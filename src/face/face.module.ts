import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeopleModule } from 'src/people/people.module';
import { PhotoModule } from 'src/photo/photo.module';
import { FaceController } from './face.controller';
import { Face } from './face.entity';
import { FaceService } from './face.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([Face]),
    forwardRef(() => PhotoModule),
    forwardRef(() => PeopleModule)
  ],
  controllers: [FaceController],
  providers: [FaceService],
  exports: [FaceService]
})
export class FaceModule {}
