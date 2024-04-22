import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { BenchmarkParticipants, CreateBenchmarkParticipantsDto } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EntityManager, QueryFailedError } from 'typeorm';
import { BenchmarkParticipantRequirementsService } from '../../participants-requirements';
import { HrmsEmployeesService } from '../../../../../services/hrms';

@Injectable()
export class BenchmarkParticipantsService extends CrudHelper<BenchmarkParticipants> {
  constructor(
    private readonly crudService: CrudService<BenchmarkParticipants>,
    private readonly hrmsEmployeesService: HrmsEmployeesService,
    private readonly benchmarkParticipantRequirementsService: BenchmarkParticipantRequirementsService
  ) {
    super(crudService);
  }

  /* find all participants */
  async findAllAssignableParticipants() {
    try {
      /* find all employees with supervisor */
      const employees = await this.hrmsEmployeesService.findAllEmployeesWithSupervisor();

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

  /* find all non participants by benchmark id */
  async findAllAssignableParticipantsByBenchmarkId(benchmarkId: string) {
    try {
      /* find all participants by benchmark id */
      const benchmarkParticipants = (await this.crudService.findAll({
        find: {
          select: {
            id: true,
            employeeId: true,
          },
          where: {
            benchmark: {
              id: benchmarkId,
            },
          },
        },
        onError: (error) => {
          throw error;
        },
      })) as Array<BenchmarkParticipants>;

      /* find all employees with supervisor */
      const employees = await this.hrmsEmployeesService.findAllEmployeesWithSupervisor();

      /* extract the employee ids from both arrays */
      const participantIds = benchmarkParticipants.map((participant) => participant.employeeId);

      /* filter employees to remove those with employee ids present in participants */
      return employees
        .filter((employee) => !participantIds.includes(employee.employee._id))
        .map((employee) => ({
          supervisorName: employee.supervisor.name,
          employeeId: employee.employee._id,
          name: employee.employee.name,
          positionTitle: employee.employee.positionTitle,
          assignment: employee.employee.assignment,
        }));
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /* find all participants by benchmark id */
  async findAllParticipantsByBenchmarkId(benchmarkId: string) {
    try {
      /* find all participants */
      const employees = (await this.crudService.findAll({
        find: {
          select: {
            id: true,
            employeeId: true,
          },
          where: {
            benchmark: {
              id: benchmarkId,
            },
          },
        },
        onError: (error) => {
          throw error;
        },
      })) as Array<BenchmarkParticipants>;

      /* custom return participants*/
      return await Promise.all(
        employees.map(async (items) => {
          /* find employee with supervisor */
          const employeeDetails = await this.hrmsEmployeesService.findEmployeesWithSupervisorByEmployeeId(items.employeeId);

          /* custom return */
          return {
            benchmarkParticipants: items.id,
            supervisorName: employeeDetails.supervisor.name,
            employeeId: items.employeeId,
            name: employeeDetails.employee.name,
          };
        })
      );
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  /*  insert benchmark participants */
  async createParticipants(data: CreateBenchmarkParticipantsDto, entityManager: EntityManager) {
    try {
      /* deconstruct data */
      const { benchmark, employeeId } = data;

      /* insert participants */
      const participants = await this.crudService.transact<BenchmarkParticipants>(entityManager).create({
        dto: {
          benchmark: {
            id: benchmark,
          },
          employeeId: employeeId,
        },
        onError: (error) => {
          throw error;
        },
      });

      /* insert requirements */
      await this.benchmarkParticipantRequirementsService.createParticipantRequirements(
        {
          benchmarkParticipants: participants.id,
        },
        entityManager
      );

      /* custom return */
      return {
        employeeId: participants.employeeId,
      };
    } catch (error) {
      Logger.error(error);
      if (error.code === '23505' && error instanceof QueryFailedError) {
        throw new HttpException('Duplicate key violation', HttpStatus.CONFLICT);
      } else {
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      }
    }
  }

  /* remove participants by benchmark id */
  async deleteParticipants(benchmarkId: string, entityManager: EntityManager) {
    try {
      return await this.crudService.transact<BenchmarkParticipants>(entityManager).delete({
        deleteBy: {
          benchmark: {
            id: benchmarkId,
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
}
