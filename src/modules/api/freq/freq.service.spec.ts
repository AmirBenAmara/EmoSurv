import { Test, TestingModule } from '@nestjs/testing';
import { FreqService } from './freq.service';

describe('FreqService', () => {
  let service: FreqService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FreqService],
    }).compile();

    service = module.get<FreqService>(FreqService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
