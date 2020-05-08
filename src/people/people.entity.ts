import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, OneToOne, JoinColumn} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Photo } from "src/photo/photo.entity";

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
  
  @ManyToMany(type => Photo, photo => photo.peoples)
  photos: Photo[];

  @OneToOne(type => Photo)
  @JoinColumn()
  profilPhoto: Photo;

}