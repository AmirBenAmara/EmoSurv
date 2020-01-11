import { Test, TestingModule } from '@nestjs/testing';
import { FreeTypingController } from './free-typing.controller';

describe('FreeTyping Controller', () => {
  let controller: FreeTypingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FreeTypingController],
    }).compile();

    controller = module.get<FreeTypingController>(FreeTypingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
