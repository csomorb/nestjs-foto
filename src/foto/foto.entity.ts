import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Album } from "src/album/album.entity";
import { Tag } from "src/tag/tag.entity";
import { People } from "src/people/people.entity";

@Entity()
export class Foto {

  @PrimaryGeneratedColumn() 
  idFoto: number;

  @ApiProperty()
  @Column() 
  title: string;

  @ApiProperty()
  @Column({nullable:true})
  description: string

  @Column("int")
  weight: number;

  @Column("int")
  height:number;

  @Column("int")
  width:number;

  @Column("datetime")
  shootDate: Date;

  @Column()
  srcOrig: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  
  @ManyToMany(type => Album, album => album.fotos)
  @JoinTable()
  albums: Album[];

  @ManyToMany(type => Tag, tag => tag.fotos)
  @JoinTable()
  tags: Tag[];

  @ManyToMany(type => People, people => people.fotos)
  @JoinTable()
  peoples: People[];

}