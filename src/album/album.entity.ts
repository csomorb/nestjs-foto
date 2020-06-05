import { Entity, Tree, PrimaryGeneratedColumn, Column, TreeChildren, TreeParent, TreeLevelColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, ManyToOne, OneToOne, JoinColumn} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Photo } from "src/photo/photo.entity";

@Entity()
@Tree("materialized-path")
export class Album {

  @PrimaryGeneratedColumn() 
  id: number;

  @ApiProperty()
  @Column() 
  title: string;

  @ApiProperty()
  @Column({nullable:true})
  description: string

  @TreeChildren()
  children: Album[];

  @TreeParent()
  parent: Album;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  
  @ManyToMany(type => Photo, photo => photo.albums)
  photos: Photo[];

  @OneToOne(type => Photo)
  @JoinColumn()
  coverPhoto: Photo;

}