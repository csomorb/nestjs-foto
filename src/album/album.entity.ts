import { Entity, Tree, PrimaryGeneratedColumn, Column, TreeChildren, TreeParent, TreeLevelColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, ManyToOne, OneToOne, JoinColumn} from "typeorm";
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
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  
  @ManyToMany(type => Foto, foto => foto.albums)
  fotos: Foto[];

  @OneToOne(type => Foto)
  @JoinColumn()
  coverFoto: Foto;

}