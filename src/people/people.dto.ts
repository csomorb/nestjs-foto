import { ApiProperty } from "@nestjs/swagger";

export class PeopleDto {
    @ApiProperty({description: 'Name'})
    readonly name: string;
    @ApiProperty({description: 'Some word about the people'})
    readonly description: string;
    @ApiProperty({description: 'Birthday date'})
    readonly birthDay?: string;
    @ApiProperty({description: 'Id of the profil foto', type: Number})
    readonly idProfilFoto?: number;
}