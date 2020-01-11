import { Test, TestingModule } from '@nestjs/testing';
import { FreeTypingService } from './free-typing.service';

describe('FreeTypingService', () => {
  let service: FreeTypingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FreeTypingService],
    }).compile();

    service = module.get<FreeTypingService>(FreeTypingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
