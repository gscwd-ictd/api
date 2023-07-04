import { Body, Controller, Post } from '@nestjs/common';
import { TrainingOrganizationDetailsService } from './training-organization-details.service';
import { CreateTrainingOrganizationDetailsDto } from '@gscwd-api/models';

@Controller({ version: '1', path: 'training-organization-details' })
export class TrainingOrganizationDetailsController {
  constructor(private readonly trainingOrganizationDetailsService: TrainingOrganizationDetailsService) {}

  // HR

  //post method for creating a training and distribution of slots
  @Post()
  async create(@Body() data: CreateTrainingOrganizationDetailsDto) {
    return await this.trainingOrganizationDetailsService.addTraining(data);
  }

  //get method to get all trainings relate to training sources
  //   @Get()
  //   async findAll(
  //     @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  //     @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  //   ): Promise<Pagination<TrainingIndividualDetails> | TrainingIndividualDetails[]> {
  //     return await this.trainingIndividualDetailsService.crud().findAll({
  //       find: {
  //         relations: { trainingSource: true, lspIndividualDetails: true },
  //         select: {
  //           createdAt: true,
  //           updatedAt: true,
  //           deletedAt: true,
  //           id: true,
  //           lspIndividualDetails: {
  //             employeeId: true,
  //             firstName: true,
  //             middleName: true,
  //             lastName: true,
  //           },
  //           location: true,
  //           courseTitle: true,
  //           trainingStart: true,
  //           trainingEnd: true,
  //           numberOfHours: true,
  //           deadlineForSubmission: true,
  //           invitationUrl: true,
  //           numberOfParticipants: true,
  //           status: true,
  //           trainingSource: {
  //             id: true,
  //             name: true,
  //           },
  //         },
  //       },
  //       pagination: { page, limit },
  //       onError: () => new InternalServerErrorException(),
  //     });
  //   }

  //get training details by training id
  //   @Get(':id')
  //   async findById(@Param('id') id: string): Promise<TrainingIndividualDetails> {
  //     return this.trainingIndividualDetailsService.getTrainingDetailsById(id);
  //   }

  // //get all nominees by training id
  // @Get(':id/nominees')
  // async findNomineeById(@Param('id') id: string) {
  //   return `training nominees by training id ${id}`;
  // }

  //patch method to update training details by training id
  //   @Patch()
  //   async update(@Body() data: UpdateTrainingIndividualDetailsDto) {
  //     return this.trainingIndividualDetailsService.updateTrainingDetails(data);
  //   }

  //delete method to remove trainings by training id
  //   @Delete(':id')
  //   async delete(@Param('id') id: string): Promise<DeleteResult> {
  //     return this.trainingIndividualDetailsService.crud().delete({
  //       deleteBy: { id },
  //       softDelete: false,
  //       onError: () => new BadRequestException(),
  //     });
  //   }

  //Employee Portal

  // //get all training by supervisor id and status
  // @Get('/supervisor/:supervisor_id')
  // async findTrainingBySupervisorId(@Param('supervisor_id') id: string) {
  //   return `training supervisor id ${id}`;
  // }

  // //get all training by supervisor id and status
  // @Get(':id/supervisor/:supervisor_id')
  // async findTrainingNomineesByTrainingIdAndSupervisorId(@Param('id') id: string, @Param('supervisor_id') supervisor_id: string) {
  //   return `training id ${id} training supervisor id ${supervisor_id}`;
  // }
}
