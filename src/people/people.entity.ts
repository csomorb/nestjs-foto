import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, OneToOne, JoinColumn} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Foto } from "src/foto/foto.entity";

@Entity()
export class People {

  @PrimaryGeneratedColumn() 
  idPeople: number;

  @ApiProperty()
  @Column() 
  name: string;

  @ApiProperty()
  @Column({nullable:true})
  description: string;

  @ApiProperty()
  @Column({nullable:true, type: "date"})
  birthDay: Date;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  
  @ManyToMany(type => Foto, foto => foto.peoples)
  fotos: Foto[];

  @OneToOne(type => Foto)
  @JoinColumn()
  profilFoto: Foto;

}