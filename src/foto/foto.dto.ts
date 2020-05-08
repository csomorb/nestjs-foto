import { ApiProperty } from "@nestjs/swagger";

export class FotoDto {
    @ApiProperty({description: 'Title of the foto'})
    readonly title?: string;
    @ApiProperty({description: 'Description of the Foto'})
    readonly description?: string;
    @ApiProperty({description: 'Id of the album', type: Number})
    readonly idAlbum?: number;
}