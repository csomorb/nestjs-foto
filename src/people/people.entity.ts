import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Photo } from "src/photo/photo.entity";
import { OneToMany } from "typeorm/decorator/relations/OneToMany";
import { FacesTaged } from "./facesTaged.entity";

@Entity()
export class People {

  @PrimaryGeneratedColumn() 
  id: number;

  @ApiProperty()
  @Column({unique: true}) 
  title: string;

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
  
  @OneToMany(() => FacesTaged, facesTaged => facesTaged.people)
  public facesTaged: FacesTaged[];

  @OneToOne(type => Photo)
  @JoinColumn()
  coverPhoto: Photo;

}

