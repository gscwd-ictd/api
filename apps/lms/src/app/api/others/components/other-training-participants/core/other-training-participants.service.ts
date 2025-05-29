import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateOtherTrainingParticipantsDto, OtherTrainingParticipant } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { HrmsEmployeesService } from '../../../../../services/hrms';
import { EntityManager } from 'typeorm';
import { OtherTrainingStatus } from '@gscwd-api/utils';
import { OtherTrainingParticipantsRequirementsService } from '../../other-training-participants-requirements';

@Injectable()
export class OtherTrainingParticipantsService extends CrudHelper<OtherTrainingParticipant> {
  constructor(
    private readonly crudService: CrudService<OtherTrainingParticipant>,
    private readonly OtherTrainingParticipantsRequirementsService: OtherTrainingParticipantsRequirementsService,
    private readonly hrmsEmployeesService: HrmsEmployeesService
  ) {
    super(crudService);
  }

  /* find all assignable participants */
  async findAllAssignableParticipants() {
    try {
      /* find all employees with supervisor */
      const employees = await this.hrmsEmployeesService.findAllPermanentCasualJOEmployeesWithSupervisor();

      /* custom return */
      return await Promise.all(
        employees.map(async (items) => {
          return {
            supervisorName: items.supervisor.name,
            employeeId: items.employee._id,
            name: items.employee.name,
            positionTitle: items.employee.positionTitle,
            assignment: items.employee.assignment,
          };
        })
      );
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /* find all non participants by other training id */
  async findAllAssignableParticipantsByOtherTrainingId(otherTrainingId: string) {
    try {
      /* find all participants by benchmark id */
      const benchmarkParticipants = (await this.crudService.findAll({
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

      /* find all employees with supervisor */
      const employees = await this.hrmsEmployeesService.findAllPermanentCasualJOEmployeesWithSupervisor();

      /* extract the employee ids from both arrays */
      const participantIds = benchmarkParticipants.map((participant) => participant.employeeId);

      /* filter employees to remove those with employee ids present in participants */
      return await Promise.all(
        employees
          .filter((employee) => !participantIds.includes(employee.employee._id))
          .map((employee) => ({
            supervisorName: employee.supervisor.name,
            employeeId: employee.employee._id,
            name: employee.employee.name,
            positionTitle: employee.employee.positionTitle,
            assignment: employee.employee.assignment,
          }))
      );
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
            assignment: employeeDetails.employee.assignment,
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

      /* insert participants requirements */
      await this.OtherTrainingParticipantsRequirementsService.createParticipantRequirements(
        { otherTrainingParticipant: participants.id },
        entityManager
      );

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

  /* remove participants by other training id */
  async deleteParticipants(otherTrainingId: string, entityManager: EntityManager) {
    try {
      return await this.crudService.transact<OtherTrainingParticipant>(entityManager).delete({
        deleteBy: {
          otherTraining: {
            id: otherTrainingId,
          },
        },
        softDelete: false,
        onError: (error) => {
          throw error;
        },
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  /* find all other training by employee id */
  async findAllOtherTrainingsByEmployeeId(employeeId: string) {
    try {
      const otherTraining = (await this.crudService.findAll({
        find: {
          relations: {
            otherTraining: true,
          },
          select: {
            otherTraining: {
              id: true,
              title: true,
              category: true,
              location: true,
              dateFrom: true,
              dateTo: true,
              status: true,
            },
          },
          where: {
            employeeId: employeeId,
          },
        },
      })) as Array<OtherTrainingParticipant>;

      /* custom return */
      return await Promise.all(
        otherTraining.map(async (items) => {
          return {
            participantId: items.id,
            otherTrainingId: items.otherTraining.id,
            title: items.otherTraining.title,
            category: items.otherTraining.category,
            location: items.otherTraining.location,
            dateFrom: items.otherTraining.dateFrom,
            dateTo: items.otherTraining.dateTo,
            status: items.otherTraining.status,
          };
        })
      );
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /* count pending other training by employee id */
  async countPendingOtherTrainingByEmployeeId(employeeId: string) {
    try {
      const count = await this.crudService.getRepository().countBy({
        otherTraining: {
          status: OtherTrainingStatus.PENDING,
        },
        employeeId: employeeId,
      });

      return {
        pending: count,
      };
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }
}
