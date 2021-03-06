import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, OneToOne, JoinColumn} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Photo } from "src/photo/photo.entity";
import { Video } from "src/video/video.entity";

@Entity()
export class Tag {

  @PrimaryGeneratedColumn() 
  id: number;

  @ApiProperty()
  @Column({unique: true}) 
  title: string;

  @ApiProperty()
  @Column({nullable:true})
  description: string

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  
  @ManyToMany(type => Photo, photo => photo.tags)
  photos: Photo[];

  @ManyToMany(type => Video, video => video.tags)
  videos: Video[];

  @OneToOne(type => Photo)
  @JoinColumn()
  coverPhoto: Photo;

}