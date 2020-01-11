import { Test, TestingModule } from '@nestjs/testing';
import { FreqController } from './freq.controller';

describe('Freq Controller', () => {
  let controller: FreqController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FreqController],
    }).compile();

    controller = module.get<FreqController>(FreqController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
