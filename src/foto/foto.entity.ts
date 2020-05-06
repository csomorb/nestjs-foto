import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Album } from "src/album/album.entity";

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
  create_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
  
  @ManyToMany(type => Album, album => album.fotos)
  @JoinTable()
  albums: Album[];

}