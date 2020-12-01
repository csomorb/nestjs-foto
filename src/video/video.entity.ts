import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Album } from "src/album/album.entity";
import { Tag } from "src/tag/tag.entity";

@Entity()
export class Video {

  @PrimaryGeneratedColumn() 
  idVideo: number;

  @ApiProperty()
  @Column() 
  title: string;

  @ApiProperty()
  @Column({nullable:true})
  description: string;

  @Column("int")
  weight: number;

  @Column("int", { nullable: true })
  height: number;

  @Column("int", { nullable: true })
  width: number;

  @Column("int", { nullable: true })
  duration: number;

  @ApiProperty()
  @Column("datetime", { nullable: true })
  shootDate: Date;

  @ApiProperty()
  @Column({ type: "decimal", precision: 10, scale: 8, nullable: true })
  lat: number;

  @ApiProperty()
  @Column({ type: "decimal", precision: 11, scale: 8, nullable: true })
  long: number;

  @Column()
  originalFileName: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  
  @ManyToMany(type => Album, album => album.videos, {
    eager: true
  })
  @JoinTable()
  albums: Album[];

  @ManyToMany(type => Tag, tag => tag.videos, {
    eager: true
  })
  @JoinTable()
  tags: Tag[];

}