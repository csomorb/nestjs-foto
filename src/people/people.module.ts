import { Module } from '@nestjs/common';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { People } from './people.entity';
import { PhotoModule } from 'src/photo/photo.module';
import { PeopleToPhoto } from './peopleToPhoto.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PeopleToPhoto]),
    TypeOrmModule.forFeature([People]),
    PhotoModule
  ],
  controllers: [PeopleController],
  providers: [PeopleService]
})
export class PeopleModule {}
