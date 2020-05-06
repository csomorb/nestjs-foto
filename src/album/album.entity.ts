import { Entity, Tree, PrimaryGeneratedColumn, Column, TreeChildren, TreeParent, TreeLevelColumn, CreateDateColumn, UpdateDateColumn, ManyToMany} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Foto } from "src/foto/foto.entity";

@Entity()
@Tree("materialized-path")
export class Album {

  @PrimaryGeneratedColumn() 
  idAlbum: number;

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
  create_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
  
  @ManyToMany(type => Foto, foto => foto.albums)
  fotos: Foto[];
}