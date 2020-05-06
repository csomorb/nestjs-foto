import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, OneToOne, JoinColumn} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Foto } from "src/foto/foto.entity";

@Entity()
export class Tag {

  @PrimaryGeneratedColumn() 
  idTag: number;

  @ApiProperty()
  @Column() 
  title: string;

  @ApiProperty()
  @Column({nullable:true})
  description: string

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  
  @ManyToMany(type => Foto, foto => foto.tags)
  fotos: Foto[];

  @OneToOne(type => Foto)
  @JoinColumn()
  coverFoto: Foto;

}