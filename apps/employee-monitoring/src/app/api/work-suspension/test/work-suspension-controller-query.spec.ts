import { BadRequestException } from '@nestjs/common';
import { WorkSuspensionType } from '@gscwd-api/models';
import { WorkSuspensionController } from '../core/work-suspension.controller';

describe('WorkSuspensionController query validation', () => {
  const service = { previewWorkSuspension: jest.fn(async () => []), getAllWorkSuspensions: jest.fn(async () => []) };
  const controller = new WorkSuspensionController(service as never);
  beforeEach(() => jest.clearAllMocks());

  it('rejects array / object query values (parameter tampering)', async () => {
    await expect(controller.previewWorkSuspension(WorkSuspensionType.TIME_OF_DAY, ['15:00', '16:00'])).rejects.toBeInstanceOf(BadRequestException);
    await expect(controller.previewWorkSuspension([WorkSuspensionType.WHOLE_DAY], undefined)).rejects.toBeInstanceOf(BadRequestException);
    await expect(controller.getAllWorkSuspensions({ $gt: '' }, undefined, undefined)).rejects.toBeInstanceOf(BadRequestException);
    expect(service.previewWorkSuspension).not.toHaveBeenCalled();
    expect(service.getAllWorkSuspensions).not.toHaveBeenCalled();
  });

  it('rejects bad formats and unknown types', async () => {
    await expect(controller.previewWorkSuspension(WorkSuspensionType.TIME_OF_DAY, '25:00')).rejects.toBeInstanceOf(BadRequestException);
    await expect(controller.previewWorkSuspension('LEGACY', undefined)).rejects.toBeInstanceOf(BadRequestException);
    await expect(controller.previewWorkSuspension(undefined, undefined)).rejects.toBeInstanceOf(BadRequestException);
    await expect(controller.getAllWorkSuspensions('2026/10/01', undefined, undefined)).rejects.toBeInstanceOf(BadRequestException);
    await expect(controller.getAllWorkSuspensions(undefined, undefined, 'yes')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('passes valid single values through', async () => {
    await controller.previewWorkSuspension(WorkSuspensionType.TIME_OF_DAY, '15:00');
    expect(service.previewWorkSuspension).toHaveBeenCalledWith(WorkSuspensionType.TIME_OF_DAY, '15:00');
    await controller.getAllWorkSuspensions('2026-10-01', '2026-10-31', 'false');
    expect(service.getAllWorkSuspensions).toHaveBeenCalledWith({ from: '2026-10-01', to: '2026-10-31', includeArchived: false });
  });
});
