import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Album } from "src/album/album.entity";
import { Tag } from "src/tag/tag.entity";
import { People } from "src/people/people.entity";

@Entity()
export class Photo {

  @PrimaryGeneratedColumn() 
  idPhoto: number;

  @ApiProperty()
  @Column() 
  title: string;

  @ApiProperty()
  @Column({nullable:true})
  description: string;

  @Column("int")
  weight: number;

  @Column("int")
  height: number;

  @Column("int")
  width: number;

  @ApiProperty()
  @Column("datetime")
  shootDate: Date;

  @ApiProperty()
  @Column({ type: "decimal", precision: 10, scale: 8, nullable: true })
  lat: number;

  @ApiProperty()
  @Column({ type: "decimal", precision: 11, scale: 8, nullable: true })
  long: number;

  @Column({ type: "int", nullable: true })
  alti: number;

  @Column()
  originalFileName: string;

  @Column({ nullable: true })
  srcOrig: string;

  @Column({ nullable: true })
  src150: string;

  @Column({ nullable: true })
  src320: string;

  @Column({ nullable: true })
  src640: string;

  @Column({ nullable: true })
  src1280: string;

  @Column({ nullable: true })
  src1920: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  
  @ManyToMany(type => Album, album => album.photos)
  @JoinTable()
  albums: Album[];

  @ManyToMany(type => Tag, tag => tag.photos)
  @JoinTable()
  tags: Tag[];

  @ManyToMany(type => People, people => people.photos)
  @JoinTable()
  peoples: People[];

}