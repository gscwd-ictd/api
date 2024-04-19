import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateOtherTrainingDto, OtherTraining, UpdateOtherTrainingDto } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OtherTrainingParticipantsService } from '../components/other-training-participants';

@Injectable()
export class OtherTrainingsService extends CrudHelper<OtherTraining> {
  constructor(
    private readonly crudService: CrudService<OtherTraining>,
    private readonly otherTrainingParticipantsService: OtherTrainingParticipantsService,
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
        const { participants, ...rest } = data;

        /* insert  other training */
        const otherTraining = await this.crudService.transact<OtherTraining>(entityManager).create({
          dto: rest,
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
        const { participants, ...rest } = data;

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
}
