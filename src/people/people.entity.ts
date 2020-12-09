import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToMany} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Photo } from "src/photo/photo.entity";
import { OneToMany } from "typeorm/decorator/relations/OneToMany";
import { Face } from "../face/face.entity";
import { Video } from "src/video/video.entity";

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
  
  @OneToMany(() => Face, faces => faces.people)
  public faces: Face[];

  @OneToOne(type => Photo)
  @JoinColumn()
  coverPhoto: Photo;

  @ManyToMany(type => Video, video => video.peoples)
  videos: Video[];
}

