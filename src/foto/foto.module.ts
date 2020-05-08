import { Module } from '@nestjs/common';
import { FotoService } from './foto.service';
import { FotoController } from './foto.controller';
import { Foto } from './foto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Foto])
  ],
  providers: [FotoService],
  controllers: [FotoController],
  exports: [FotoService]
})
export class FotoModule {}
