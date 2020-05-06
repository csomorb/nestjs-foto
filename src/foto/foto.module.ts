import { Module } from '@nestjs/common';
import { FotoService } from './foto.service';
import { FotoController } from './foto.controller';

@Module({
  providers: [FotoService],
  controllers: [FotoController]
})
export class FotoModule {}
