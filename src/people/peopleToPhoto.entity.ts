import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, OneToOne, JoinColumn} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Photo } from "src/photo/photo.entity";
import { ManyToOne } from "typeorm/decorator/relations/ManyToOne";
import { People } from "./people.entity";

@Entity()
export class PeopleToPhoto {
  @PrimaryGeneratedColumn()
    public postToCategoryId!: number;

    @Column()
    public idPhoto!: number;

    @Column()
    public idPeople!: number;

    @Column({type: "float", nullable:true})
    public avg!: number;

    @Column({type: "float", nullable:true})
    public x!: number;

    @Column({type: "float", nullable:true})
    public y!: number;

    @Column({type: "float", nullable:true})
    public h!: number;

    @Column({type: "float", nullable:true})
    public w!: number;

    @Column({type: "smallint", nullable:true})
    public d!: number;

    @Column({ type: "json", nullable: true })
    public similarity!: string;

    @ManyToOne(() => Photo, photo => photo.peopleToPhoto)
    public photo!: Photo;

    @ManyToOne(() => People, people => people.peopleToPhoto)
    public people!: People;
}