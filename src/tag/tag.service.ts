import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { Repository } from 'typeorm';
import { TagDto } from './tag.dto';
import { Photo } from 'src/photo/photo.entity';
import { PhotoService } from 'src/photo/photo.service';


@Injectable()
export class TagService {
    constructor(
        @InjectRepository(Tag)
        private tagRepository: Repository<Tag>,
        private photoService: PhotoService
      ) {}
    
      findAll(): Promise<Tag[]> {
        return this.tagRepository.find();
      }
    
      findOne(id: string): Promise<Tag> {
        return this.tagRepository.findOne(id, { relations: ["coverPhoto"] });
      }
    
      findTagWithPhotos(id: string): Promise<Tag> {
        return this.tagRepository.findOne(id, { relations: ["photos"] });
      }
    
      async remove(id: string): Promise<void> {
        await this.tagRepository.delete(id);
      }
    
      async update(id: string, tagDto: TagDto): Promise<Tag> {
        let tag: Tag = await this.tagRepository.findOne(id);
        return await this.tagRepository.save({...tag, ...tagDto});
      }
    
      async create(tagDto: TagDto): Promise<Tag> {
        const tag = new Tag();
        tag.title = tagDto.title;
        tag.description = tagDto.description;
        if(tagDto.idCoverPhoto){
            const coverPhoto: Photo = await this.photoService.findOne(''+tagDto.idCoverPhoto);
            tag.coverPhoto = coverPhoto;
        }
        return this.tagRepository.save(tag);
      }
}
