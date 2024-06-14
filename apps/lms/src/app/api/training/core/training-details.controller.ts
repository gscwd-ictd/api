import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  BatchRequirementsDto,
  CreateAdditionalNomineesDto,
  CreateStandInNomineeDto,
  CreateTrainingBatchDto,
  CreateTrainingExternalDto,
  CreateTrainingInternalDto,
  SendTrainingNoticeExternalDto,
  SendTrainingNoticeInternalDto,
  TrainingDetails,
  UpdateTrainingBatchDto,
  UpdateTrainingExternalDto,
  UpdateTrainingInternalDto,
  UpdateTrainingStatusDto,
} from '@gscwd-api/models';
import { TrainingDetailsService } from './training-details.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { FindAllTrainingInterceptor } from '../misc/interceptors';
import { NomineeType, TrainingNomineeStatus, TrainingStatus } from '@gscwd-api/utils';
import { TrainingNomineesService } from '../components/nominees';
import { TrainingRequirementsService } from '../components/requirements';
import { TrainingDistributionsService } from '../components/slot-distributions';

@Controller({ version: '1', path: 'training' })
export class TrainingDetailsController {
  constructor(
    private readonly trainingDetailsService: TrainingDetailsService,
    private readonly trainingNomineesService: TrainingNomineesService,
    private readonly trainingRequirementsService: TrainingRequirementsService,
    private readonly trainingDistributionsService: TrainingDistributionsService
  ) {}

  /* find all training */
  @UseInterceptors(FindAllTrainingInterceptor)
  @Get()
  async findAllTraining(
    @Query('page', new DefaultValuePipe('1'), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe('10'), ParseIntPipe) limit: number
  ): Promise<Pagination<TrainingDetails> | TrainingDetails[]> {
    return await this.trainingDetailsService.crud().findAll({
      find: {
        relations: {
          source: true,
          trainingDesign: true,
        },
        select: {
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
          id: true,
          trainingDesign: {
            courseTitle: true,
          },
          courseTitle: true,
          numberOfParticipants: true,
          location: true,
          trainingStart: true,
          trainingEnd: true,
          source: {
            name: true,
          },
          type: true,
          status: true,
        },
        order: {
          updatedAt: 'DESC',
        },
      },
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  /* find all ongoing training */
  @UseInterceptors(FindAllTrainingInterceptor)
  @Get('ongoing')
  async findAllOngoingTraining(
    @Query('page', new DefaultValuePipe('1'), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe('10'), ParseIntPipe) limit: number
  ): Promise<Pagination<TrainingDetails> | TrainingDetails[]> {
    return await this.trainingDetailsService.crud().findAll({
      find: {
        relations: {
          source: true,
          trainingDesign: true,
        },
        select: {
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
          id: true,
          trainingDesign: {
            courseTitle: true,
          },
          courseTitle: true,
          numberOfParticipants: true,
          location: true,
          trainingStart: true,
          trainingEnd: true,
          source: {
            name: true,
          },
          type: true,
          status: true,
        },
        where: {
          status: TrainingStatus.ON_GOING_TRAINING,
        },
        order: {
          updatedAt: 'DESC',
        },
      },
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  /* find all requirements submission training */
  @UseInterceptors(FindAllTrainingInterceptor)
  @Get('recent')
  async findAllRequirementsSubmissionTraining(
    @Query('page', new DefaultValuePipe('1'), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe('10'), ParseIntPipe) limit: number
  ): Promise<Pagination<TrainingDetails> | TrainingDetails[]> {
    return await this.trainingDetailsService.crud().findAll({
      find: {
        relations: {
          source: true,
          trainingDesign: true,
        },
        select: {
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
          id: true,
          trainingDesign: {
            courseTitle: true,
          },
          courseTitle: true,
          numberOfParticipants: true,
          location: true,
          trainingStart: true,
          trainingEnd: true,
          source: {
            name: true,
          },
          type: true,
          status: true,
        },
        where: {
          status: TrainingStatus.REQUIREMENTS_SUBMISSION,
        },
        order: {
          updatedAt: 'DESC',
        },
      },
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  /* find all completed training */
  @UseInterceptors(FindAllTrainingInterceptor)
  @Get('history')
  async findAllCompletedTraining(
    @Query('page', new DefaultValuePipe('1'), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe('10'), ParseIntPipe) limit: number
  ): Promise<Pagination<TrainingDetails> | TrainingDetails[]> {
    return await this.trainingDetailsService.crud().findAll({
      find: {
        relations: {
          source: true,
          trainingDesign: true,
        },
        select: {
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
          id: true,
          trainingDesign: {
            courseTitle: true,
          },
          courseTitle: true,
          numberOfParticipants: true,
          location: true,
          trainingStart: true,
          trainingEnd: true,
          source: {
            name: true,
          },
          type: true,
          status: true,
        },
        where: {
          status: TrainingStatus.COMPLETED,
        },
        order: {
          updatedAt: 'DESC',
        },
      },
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  /* find training by id */
  @Get(':id')
  async findTrainingDetailsById(@Param('id') id: string) {
    return await this.trainingDetailsService.findTrainingDetailsById(id);
  }

  /* insert training (source = internal) */
  @Post('internal')
  async createTrainingInternal(@Body() data: CreateTrainingInternalDto) {
    return await this.trainingDetailsService.createTrainingInternal(data);
  }

  /* insert training (source = external) */
  @Post('external')
  async createTrainingExternal(@Body() data: CreateTrainingExternalDto) {
    return await this.trainingDetailsService.createTrainingExternal(data);
  }

  /* edit training by id (source = internal) */
  @Put('internal')
  async updateTrainingInternalById(@Body() data: UpdateTrainingInternalDto) {
    return await this.trainingDetailsService.updateTrainingInternalById(data);
  }

  /* edit training by id (source = external) */
  @Put('external')
  async updateTrainingExternalById(@Body() data: UpdateTrainingExternalDto) {
    return await this.trainingDetailsService.updateTrainingExternalById(data);
  }

  /* remove training by id */
  @Delete(':id')
  async deleteTrainingById(@Param('id') id: string) {
    return await this.trainingDetailsService.crud().delete({
      deleteBy: { id: id },
      softDelete: false,
      onError: () => new BadRequestException(),
    });
  }

  /* send a training notice to the manager to nominate (source = internal) */
  @Patch('notices/internal')
  async sendNoticeToManagersInternal(@Body() data: SendTrainingNoticeInternalDto) {
    return await this.trainingDetailsService.sendNoticeToManagersInternal(data);
  }

  /* send a training notice to the manager to nominate (source = external) */
  @Patch('notices/external')
  async sendNoticeToManagersExternal(@Body() data: SendTrainingNoticeExternalDto) {
    return await this.trainingDetailsService.sendNoticeToManagersExternal(data);
  }

  /* find all accepted nominees by training id */
  @Get(':id/nominees/accepted')
  async findAllAcceptedNomineesByTrainingId(@Param('id') id: string) {
    const trainingStatus = TrainingStatus.ON_GOING_NOMINATION;
    const nomineeType = NomineeType.NOMINEE;
    const nomineeStatus = TrainingNomineeStatus.ACCEPTED;
    return await this.trainingNomineesService.findAllNomineeByTrainingId(id, trainingStatus, nomineeType, nomineeStatus);
  }

  /* find all nominees by training id */
  @Get(':id/nominees')
  async findAllNomineesByTrainingId(@Param('id') id: string) {
    return await this.trainingDetailsService.findAndCountNomineeByTrainingId(id);
  }

  /* send approvals to the personnel development committee */
  @Patch(':id/approvals')
  async updateTrainingStatusToAppovals(@Param('id') id: string) {
    return await this.trainingDetailsService.sendToPdc(id);
  }

  /* find all nominees in all batches by training id */
  @Get(':id/nominees/batch')
  async findAllNomineeInBatchesByTrainingId(@Param('id') trainingId: string) {
    return await this.trainingNomineesService.findAllNomineeInBatchesByTrainingId(trainingId);
  }

  /* insert a batch training */
  @Post('batch')
  async createTrainingBatch(@Body() data: CreateTrainingBatchDto) {
    return await this.trainingDetailsService.createTrainingBatch(data);
  }

  /* find all batches by training id */
  @Get(':id/batch')
  async findAllBatchByTrainingId(@Param('id') id: string) {
    return await this.trainingNomineesService.findAllBatchByTrainingId(id);
  }

  /* edit a batch training */
  @Patch('batch')
  async updateTrainingBatch(@Body() data: UpdateTrainingBatchDto) {
    return await this.trainingDetailsService.updateTrainingBatch(data);
  }

  /* edit training status */
  @Patch()
  async updateTrainingStatus(@Body() data: UpdateTrainingStatusDto) {
    return await this.trainingDetailsService.updateTrainingStatus(data);
  }

  /* find all nominee requirements by training id */
  @Get(':id/requirements')
  async findAllNomineesRequirementsByTrainingId(@Param('id') id: string) {
    return await this.trainingDetailsService.findNomineesRequirementsByTrainingId(id);
  }

  /* find all nominee requirements by training id */
  @Put('requirements')
  async updateNomineeRequirements(@Body() data: BatchRequirementsDto) {
    return await this.trainingRequirementsService.updateNomineeRequirements(data);
  }

  @Get(':trainingId/distributions')
  async findAllSupervisorDistributionByTrainingId(@Param('trainingId') trainingId: string) {
    return await this.trainingDistributionsService.findAllSupervisorDistributionByTrainingId(trainingId);
  }

  /* find all available supervisors by training id */
  @Get(':trainingId/distributions/supervisors')
  async findAllSupervisors(@Param('trainingId') trainingId: string) {
    return await this.trainingDetailsService.findAllSupervisorsByTrainingId(trainingId);
  }

  /* find assignable employee under supervisor by training id */
  @Get(':trainingId/distributions/supervisors/:supervisorId')
  async findAllAssignableEmployeeUnderSupervisor(@Param('trainingId') trainingId: string, @Param('supervisorId') supervisorId: string) {
    return await this.trainingDetailsService.findAllAssignableEmployeeUnderSupervisor(trainingId, supervisorId);
  }

  /* find stand in by distribution id */
  @Get('distributions/:distributionId/standin')
  async findStandInNomineeByDistributionId(@Param('distributionId') distributionId: string) {
    return await this.trainingNomineesService.findStandInNomineeByDistributionId(distributionId);
  }

  /* create stand in nominee */
  @Post('distributions/standin')
  async createStandinNominee(@Body() data: CreateStandInNomineeDto) {
    return await this.trainingNomineesService.createStandinNominee(data);
  }

  /* create additional trainees */
  @Post('additional-trainees')
  async createAdditionalTrainees(@Body() data: CreateAdditionalNomineesDto) {
    return await this.trainingDistributionsService.createAdditionalNominees(data);
  }
}
