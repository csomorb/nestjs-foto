import { ApiProperty } from "@nestjs/swagger";

export class TagDto {
    @ApiProperty({description: 'Title of the tag'})
    readonly title: string;
    @ApiProperty({description: 'Description of the tag'})
    readonly description: string;
    @ApiProperty({description: 'Id of the cover Foto', type: Number})
    readonly idCoverFoto?: number;
}