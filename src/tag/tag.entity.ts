import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, OneToOne, JoinColumn} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Photo } from "src/photo/photo.entity";

@Entity()
export class Tag {

  @PrimaryGeneratedColumn() 
  idTag: number;

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

  @OneToOne(type => Photo)
  @JoinColumn()
  coverPhoto: Photo;

}