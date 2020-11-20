import { Module } from '@nestjs/common';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { People } from './people.entity';
import { PhotoModule } from 'src/photo/photo.module';
import { FacesTaged } from './facesTaged.entity';
import { FaceService } from 'src/face/face.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FacesTaged]),
    TypeOrmModule.forFeature([People]),
    PhotoModule
  ],
  controllers: [PeopleController],
  providers: [PeopleService]
})
export class PeopleModule {}
