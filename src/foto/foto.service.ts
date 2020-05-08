import { Injectable } from '@nestjs/common';
import { Foto } from './foto.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FotoService {
    constructor(
        @InjectRepository(Foto)
        private fotoRepository: Repository<Foto>,
    ) {}

    async create(foto: Foto): Promise<Foto> {
        return this.fotoRepository.save(foto);
    }

    findOne(id: string): Promise<Foto> {
        return this.fotoRepository.findOne(id);
    }

    async update(id: string, foto: Foto): Promise<Foto> {
        let fotoSrc: Foto = await this.fotoRepository.findOne(id);
        return await this.fotoRepository.save({...fotoSrc, ...foto});
    }
    
      
}
