import { Test, TestingModule } from '@nestjs/testing';
import { FotoController } from './foto.controller';

describe('Foto Controller', () => {
  let controller: FotoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FotoController],
    }).compile();

    controller = module.get<FotoController>(FotoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
