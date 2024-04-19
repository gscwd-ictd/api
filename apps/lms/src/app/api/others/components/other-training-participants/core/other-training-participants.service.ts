import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateOtherTrainingParticipantsDto, OtherTrainingParticipant } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { HrmsEmployeesService } from '../../../../../services/hrms';
import { EntityManager } from 'typeorm';

@Injectable()
export class OtherTrainingParticipantsService extends CrudHelper<OtherTrainingParticipant> {
  constructor(private readonly crudService: CrudService<OtherTrainingParticipant>, private readonly hrmsEmployeesService: HrmsEmployeesService) {
    super(crudService);
  }

  /* find all participants by other training id */
  async findAllParticipantsByOtherTrainingsId(otherTrainingId: string) {
    try {
      /* find all participants */
      const participants = (await this.crudService.findAll({
        find: {
          select: {
            id: true,
            employeeId: true,
          },
          where: {
            otherTraining: {
              id: otherTrainingId,
            },
          },
        },
        onError: (error) => {
          throw error;
        },
      })) as Array<OtherTrainingParticipant>;

      return await Promise.all(
        participants.map(async (items) => {
          /* find employee with supervisor */
          const employeeDetails = await this.hrmsEmployeesService.findEmployeesWithSupervisorByEmployeeId(items.employeeId);

          /* custom return */
          return {
            participantId: items.id,
            supervisorName: employeeDetails.supervisor.name,
            employeeId: items.employeeId,
            name: employeeDetails.employee.name,
          };
        })
      );
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /*  insert other training participants */
  async createParticipants(data: CreateOtherTrainingParticipantsDto, entityManager: EntityManager) {
    try {
      /* deconstruct data */
      const { otherTraining, employeeId } = data;

      /* insert participants */
      const participants = await this.crudService.transact<OtherTrainingParticipant>(entityManager).create({
        dto: {
          otherTraining: {
            id: otherTraining,
          },
          employeeId: employeeId,
        },
        onError: (error) => {
          throw error;
        },
      });

      /* custom return */
      return {
        participantId: participants.id,
        employeeId: participants.employeeId,
      };
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }
}
