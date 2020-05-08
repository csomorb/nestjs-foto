import { Module } from '@nestjs/common';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { People } from './people.entity';
import { FotoModule } from 'src/foto/foto.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([People]),
    FotoModule
  ],
  controllers: [PeopleController],
  providers: [PeopleService]
})
export class PeopleModule {}
