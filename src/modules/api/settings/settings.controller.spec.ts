import { Test, TestingModule } from '@nestjs/testing';
import { SettingsController } from './settings.controller';

describe('Settings Controller', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [SettingsController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: SettingsController = module.get<SettingsController>(SettingsController);
    expect(controller).toBeDefined();
  });
});
