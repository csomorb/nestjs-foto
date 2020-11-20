import { forwardRef, Module } from '@nestjs/common';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { People } from './people.entity';
import { PhotoModule } from 'src/photo/photo.module';
import { FaceModule } from 'src/face/face.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([People]),
    forwardRef(() => FaceModule),
    forwardRef(() => PhotoModule),
  ],
  controllers: [PeopleController],
  providers: [PeopleService],
  exports: [PeopleService]
})
export class PeopleModule {}
