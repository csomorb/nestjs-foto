import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsOptional } from "class-validator";
import { Type } from 'class-transformer';

export class PeopleDto {
    @ApiProperty({description: 'Name'})
    readonly title: string;
    @ApiProperty({description: 'Some word about the people'})
    readonly description: string;
    @ApiProperty({description: 'Birthday date'})
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    readonly birthDay?: Date;
    @ApiProperty({description: 'Id of the profil photo', type: Number})
    readonly idCoverPhoto?: number;
}

export class PeopleFaceDto {
    @ApiProperty({description: 'Id of the Photo to facetag'})
    readonly idPhoto: number;
    @ApiProperty({description: 'Id of the People to facetag'})
    readonly idPeople?: number;
    @ApiProperty({description: 'Relative position x of the face'})
    readonly x: number;
    @ApiProperty({description: 'Relative position y of the face'})
    readonly y: number;
    @ApiProperty({description: 'Relative height of the face'})
    readonly h: number;
    @ApiProperty({description: 'Relative width of the face'})
    readonly w: number;
}