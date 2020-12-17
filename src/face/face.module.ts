import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { PeopleModule } from 'src/people/people.module';
import { PhotoModule } from 'src/photo/photo.module';
import { UserModule } from 'src/user/user.module';
import { FaceController } from './face.controller';
import { Face } from './face.entity';
import { FaceService } from './face.service';

@Module({
  imports:[
    UserModule,
    AuthModule,
    TypeOrmModule.forFeature([Face]),
    forwardRef(() => PhotoModule),
    forwardRef(() => PeopleModule)
  ],
  controllers: [FaceController],
  providers: [FaceService],
  exports: [FaceService]
})
export class FaceModule {}
