import { CreateWorkSuspensionDto, UpdateWorkSuspensionDto, WorkSuspensionType } from '@gscwd-api/models';
import { BadRequestException, Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, ValidationPipe } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { WorkSuspensionService } from './work-suspension.service';
// resolved lazily through ModuleRef: LeaveAddBackModule already imports WorkSuspensionModule
import { WorkSuspensionAddBackService } from '../../leave/components/leave-add-back/core/work-suspension-add-back.service';

// the global ValidationPipe is disabled in main.ts, so validate here; whitelist drops extra fields (e.g. app: 'ems')
const validation = new ValidationPipe({ transform: true, whitelist: true });

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

/**
 * Query values can arrive as arrays (?a=1&a=2) or objects (?a[b]=1). Accept a single string only,
 * optionally matching a pattern / allowed list (CodeQL: type confusion through parameter tampering).
 */
function singleQueryValue(value: unknown, name: string, options: { pattern?: RegExp; allowed?: readonly string[] } = {}): string | undefined {
  if (value === undefined || value === '') return undefined;
  if (typeof value !== 'string') throw new BadRequestException(`${name} must be a single value.`);
  if (options.pattern && !options.pattern.test(value)) throw new BadRequestException(`Invalid ${name}.`);
  if (options.allowed && !options.allowed.includes(value)) throw new BadRequestException(`Invalid ${name}.`);
  return value;
}

@Controller({ version: '1', path: 'work-suspension' })
export class WorkSuspensionController {
  constructor(private readonly workSuspensionService: WorkSuspensionService, private readonly moduleRef?: ModuleRef) {}

  private addBack(): WorkSuspensionAddBackService | null {
    try {
      return this.moduleRef?.get(WorkSuspensionAddBackService, { strict: false }) ?? null;
    } catch {
      return null;
    }
  }

  /** ?from=YYYY-MM-DD&to=YYYY-MM-DD&includeArchived=false (default: last 6 months, archived included) */
  @Get('')
  async getAllWorkSuspensions(@Query('from') from?: unknown, @Query('to') to?: unknown, @Query('includeArchived') includeArchived?: unknown) {
    const archived = singleQueryValue(includeArchived, 'includeArchived', { allowed: ['true', 'false'] });
    return await this.workSuspensionService.getAllWorkSuspensions({
      from: singleQueryValue(from, 'from', { pattern: DATE_PATTERN }),
      to: singleQueryValue(to, 'to', { pattern: DATE_PATTERN }),
      includeArchived: archived === undefined ? undefined : archived === 'true',
    });
  }

  /** ?suspensionType=WHOLE_DAY|TIME_OF_DAY&suspensionStartTime=HH:mm */
  @Get('preview')
  async previewWorkSuspension(@Query('suspensionType') suspensionType: unknown, @Query('suspensionStartTime') suspensionStartTime?: unknown) {
    const type = singleQueryValue(suspensionType, 'suspensionType', {
      allowed: [WorkSuspensionType.WHOLE_DAY, WorkSuspensionType.TIME_OF_DAY],
    }) as WorkSuspensionType | undefined;
    if (!type) throw new BadRequestException('suspensionType is required.');
    return await this.workSuspensionService.previewWorkSuspension(
      type,
      singleQueryValue(suspensionStartTime, 'suspensionStartTime', { pattern: TIME_PATTERN })
    );
  }

  @Post()
  async createWorkSuspension(@Body(validation) workSuspensionDto: CreateWorkSuspensionDto) {
    const created = await this.workSuspensionService.createWorkSuspension(workSuspensionDto);
    const leaveAddBack = await this.addBack()?.applyForSuspension(await this.workSuspensionService.getActiveWorkSuspensionById(created.id));
    return { ...created, leaveAddBack };
  }

  @Patch(':work_suspension_id')
  async updateWorkSuspension(
    @Param('work_suspension_id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true, skipMissingProperties: true })) updateDto: UpdateWorkSuspensionDto
  ) {
    const result = await this.workSuspensionService.updateWorkSuspension(id, updateDto);
    const leaveAddBack = await this.addBack()?.reapplyForSuspension(id);
    return { ...result, leaveAddBack };
  }

  @Delete(':work_suspension_id')
  async deleteWorkSuspension(@Param('work_suspension_id', ParseUUIDPipe) id: string) {
    // check archived / not found first, then undo the credits, then delete
    await this.workSuspensionService.assertEditable(id);
    const leaveAddBack = await this.addBack()?.reverseForSuspension(id);
    const deleted = await this.workSuspensionService.deleteWorkSuspension(id);
    return { ...deleted, leaveAddBack };
  }
}
