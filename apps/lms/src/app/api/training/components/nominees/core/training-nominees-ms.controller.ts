import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { TrainingPatterns } from '@gscwd-api/microservices';
import { TrainingNomineesService } from './training-nominees.service';
import { CreateTrainingNomineeDto, UpdateTrainingNomineeStatusDto } from '@gscwd-api/models';
import { NomineeRaw, TrainingNomineeRaw } from '@gscwd-api/utils';

@Controller()
export class TrainingNomineesMicroserviceController {
  constructor(private readonly trainingNomineesService: TrainingNomineesService) {}
}
