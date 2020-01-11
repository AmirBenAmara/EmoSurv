import { Test, TestingModule } from '@nestjs/testing';
import { TextTypingController } from './text-typing.controller';

describe('TextTyping Controller', () => {
  let controller: TextTypingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TextTypingController],
    }).compile();

    controller = module.get<TextTypingController>(TextTypingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
