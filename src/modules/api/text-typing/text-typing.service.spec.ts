import { Test, TestingModule } from '@nestjs/testing';
import { TextTypingService } from './text-typing.service';

describe('TextTypingService', () => {
  let service: TextTypingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TextTypingService],
    }).compile();

    service = module.get<TextTypingService>(TextTypingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
