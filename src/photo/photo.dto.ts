import { ApiProperty } from "@nestjs/swagger";

export class PhotoDto {
    @ApiProperty({description: 'Title of the photo'})
    readonly title?: string;
    @ApiProperty({description: 'Description of the Photo'})
    readonly description?: string;
    @ApiProperty({description: 'Id of the album', type: Number})
    readonly idAlbum?: number;
}