import { forwardRef, Module } from '@nestjs/common';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { People } from './people.entity';
import { PhotoModule } from 'src/photo/photo.module';
import { FaceModule } from 'src/face/face.module';
import { VideoModule } from 'src/video/video.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    TypeOrmModule.forFeature([People]),
    forwardRef(() => FaceModule),
    forwardRef(() => PhotoModule),
    forwardRef(() => VideoModule),
  ],
  controllers: [PeopleController],
  providers: [PeopleService],
  exports: [PeopleService]
})
export class PeopleModule {}
