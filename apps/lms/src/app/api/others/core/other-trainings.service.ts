import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateOtherTrainingDto, OtherTraining, UpdateOtherTrainingDto } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OtherTrainingParticipantsService } from '../components/other-training-participants';
import { Cron } from '@nestjs/schedule';
import { OtherTrainingStatus, RequirementsRaw } from '@gscwd-api/utils';
import { OtherTrainingParticipantsRequirementsService } from '../components/other-training-participants-requirements';
import { HttpStatusCode } from 'axios';

@Injectable()
export class OtherTrainingsService extends CrudHelper<OtherTraining> {
  constructor(
    private readonly crudService: CrudService<OtherTraining>,
    private readonly otherTrainingParticipantsService: OtherTrainingParticipantsService,
    private readonly otherTrainingParticipantsRequirementsService: OtherTrainingParticipantsRequirementsService,
    private readonly dataSource: DataSource
  ) {
    super(crudService);
  }

  /* find other training by id */
  async findOtherTrainingById(id: string) {
    try {
      /* find other training */
      const otherTraining = await this.crudService.findOneBy({
        findBy: {
          id: id,
        },
        onError: () => {
          throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        },
      });

      /* find participants */
      const participants = await this.otherTrainingParticipantsService.findAllParticipantsByOtherTrainingsId(id);

      /* custom return */
      return {
        ...otherTraining,
        trainingRequirements: JSON.parse(otherTraining.trainingRequirements),
        participants: participants,
      };
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  /* insert other trainings */
  async createOtherTrainings(data: CreateOtherTrainingDto) {
    try {
      return await this.dataSource.transaction(async (entityManager) => {
        /* deconstruct data */
        const { participants, trainingRequirements, ...rest } = data;

        /* insert  other training */
        const otherTraining = await this.crudService.transact<OtherTraining>(entityManager).create({
          dto: {
            ...rest,
            trainingRequirements: JSON.stringify(trainingRequirements),
          },
          onError: (error) => {
            throw error;
          },
        });

        /* insert participants */
        const employees = await Promise.all(
          participants.map(async (items) => {
            return await this.otherTrainingParticipantsService.createParticipants(
              {
                otherTraining: otherTraining.id,
                employeeId: items.employeeId,
              },
              entityManager
            );
          })
        );

        /* custom return */
        return {
          ...otherTraining,
          trainingRequirements: JSON.parse(otherTraining.trainingRequirements),
          participants: employees,
        };
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  /* edit other training by id */
  async updateOtherTrainingById(id: string, data: UpdateOtherTrainingDto) {
    try {
      return await this.dataSource.transaction(async (entityManager) => {
        /* deconstruct data */
        const { participants, trainingRequirements, ...rest } = data;

        /* check if other training id is existing */
        await this.crudService.transact<OtherTraining>(entityManager).findOneBy({
          findBy: {
            id: id,
          },
          onError: () => {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
          },
        });

        /* remove all participants by other training id */
        const deleteParticipants = await this.otherTrainingParticipantsService.deleteParticipants(id, entityManager);

        /* validate deleted value */
        if (deleteParticipants.affected > 0) {
          /* insert new participants */
          await Promise.all(
            participants.map(async (items) => {
              /* insert participants */
              return await this.otherTrainingParticipantsService.createParticipants(
                {
                  otherTraining: id,
                  employeeId: items.employeeId,
                },
                entityManager
              );
            })
          );

          /* return updated  */
          return await this.crudService.transact<OtherTraining>(entityManager).update({
            updateBy: {
              id: id,
            },
            dto: {
              ...rest,
              trainingRequirements: JSON.stringify(trainingRequirements),
            },
          });
        } else {
          return {
            affected: 0,
          };
        }
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  /* scheduler update other training status  */
  @Cron('* 59 23 * * *')
  async updateOtherTrainingStatus() {
    try {
      const currentDate = new Date();

      Logger.log('------ Update other training status to done -----------');

      return await this.crudService.update({
        updateBy: {
          dateTo: currentDate,
        },
        dto: {
          status: OtherTrainingStatus.REQUIREMENTS_SUBMISSION,
        },
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  /* set training completed */
  async closeOtherTraining(trainingId: string) {
    try {
      return await this.crudService.update({
        updateBy: {
          id: trainingId,
        },
        dto: {
          status: OtherTrainingStatus.COMPLETED,
        },
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad request.', HttpStatusCode.BadRequest);
    }
  }

  /* find other training participants requirements */
  async findAllParticipantsRequirements(otherTrainingId: string) {
    try {
      const trainingRequirements = (await this.findOtherTrainingById(otherTrainingId)).trainingRequirements as Array<RequirementsRaw>;

      const participants = await this.otherTrainingParticipantsService.findAllParticipantsByOtherTrainingsId(otherTrainingId);

      const participantsRequirement = await Promise.all(
        participants.map(async (items) => {
          /* find participant requirements by participant id */
          const requirements = (await this.otherTrainingParticipantsRequirementsService.findParticipantsRequirementsByParticipantId(
            items.participantId
          )) as Array<RequirementsRaw>;

          /* compare training requirements to participant requirements */
          const participantRequirements = trainingRequirements.map((req) => ({
            document: req.document,
            isSelected: requirements.some((item) => item.document === req.document),
          }));

          return {
            participantId: items.participantId,
            employeeId: items.employeeId,
            name: items.name,
            assignment: items.assignment,
            requirements: participantRequirements,
          };
        })
      );

      return {
        requirements: trainingRequirements,
        participants: participantsRequirement,
      };
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Not found.', HttpStatus.NOT_FOUND);
    }
  }
}
