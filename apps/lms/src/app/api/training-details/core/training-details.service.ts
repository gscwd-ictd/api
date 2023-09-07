import { CrudHelper, CrudService } from '@gscwd-api/crud';
import {
  CreateTrainingDetailsDto,
  LspIndividualDetails,
  LspOrganizationDetails,
  TrainingDetails,
  TrainingDetailsView,
  TrainingDistribution,
  TrainingLspIndividual,
  TrainingLspOrganization,
  TrainingRecommendedEmployee,
  TrainingTag,
  UpdateTrainingDetailsDto,
} from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, DeleteResult } from 'typeorm';
import { TrainingDistributionsService } from '../components/training-distributions';
import { TrainingTagsService } from '../components/training-tags';
import { LspIndividualDetailsService } from '../../lsp-individual-details';
import { LspOrganizationDetailsService } from '../../lsp-organization-details';
import { TrainingLspIndividualService } from '../components/training-lsp-individual';
import { TrainingLspOrganizationService } from '../components/training-lsp-organization';
import { TrainingRecommendedEmployeeService } from '../components/training-recommended-employee';
import { LspType } from '@gscwd-api/utils';

@Injectable()
export class TrainingDetailsService extends CrudHelper<TrainingDetails> {
  constructor(
    private readonly crudService: CrudService<TrainingDetails>,
    private readonly trainingDistributionsService: TrainingDistributionsService,
    private readonly trainingRecommendedEmployeeService: TrainingRecommendedEmployeeService,
    private readonly trainingTagsService: TrainingTagsService,
    private readonly lspIndividualDetailsService: LspIndividualDetailsService,
    private readonly lspOrganizationDetailsService: LspOrganizationDetailsService,
    private readonly trainingLspIndividualService: TrainingLspIndividualService,
    private readonly trainingLspOrganizationService: TrainingLspOrganizationService,
    private readonly datasource: DataSource
  ) {
    super(crudService);
  }

  //HR create training individual details and distribute slots to selected managers

  async addTrainingDetails(lspType: LspType, data: CreateTrainingDetailsDto) {
    //disconstruct dto
    const { courseContent, postTrainingRequirements, lspDetails, trainingTags, slotDistribution, ...rest } = data;

    try {
      //transaction result
      const result = await this.datasource.transaction(async (entityManager) => {
        //condition if learning service provider is individual or organization
        if (lspType === LspType.INDIVIDUAL) {
          //insert training details
          const trainingDetails = await this.crudService.transact<TrainingDetails>(entityManager).create({
            dto: {
              ...rest,
              courseContent: JSON.stringify(courseContent),
              postTrainingRequirements: JSON.stringify(postTrainingRequirements),
            },
            onError: ({ error }) => {
              return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
            },
          });

          //find learning service provider details
          const lspIndividualDetails = await this.lspIndividualDetailsService
            .crud()
            .transact<LspIndividualDetails>(entityManager)
            .findOneBy({
              findBy: { id: lspDetails },
              onError: ({ error }) => {
                return new HttpException(error, HttpStatus.NOT_FOUND, { cause: error as Error });
              },
            });

          //insert training learning service provider individual
          const lsp = await this.trainingLspIndividualService.addTrainingLspIndividual(
            {
              trainingDetails,
              lspIndividualDetails,
            },
            entityManager
          );

          //insert multiple tags in a training
          const tag = await Promise.all(
            trainingTags.map(async (tagItem) => {
              return await this.trainingTagsService.addTrainingTag(
                {
                  trainingDetails,
                  ...tagItem,
                },
                entityManager
              );
            })
          );

          //insert slot distribution and recommended employee in a training
          const distribution = await Promise.all(
            //map slot distribution
            slotDistribution.map(async (slotDistributionItem) => {
              //deconstruct slot distribution dto
              const { recommendedEmployee, ...rest } = slotDistributionItem;

              //insert training distribution
              const trainingDistribution = await this.trainingDistributionsService.addTrainingDistribution(
                {
                  trainingDetails,
                  ...rest,
                },
                entityManager
              );

              //insert recommended employee
              const recommended = await Promise.all(
                recommendedEmployee.map(async (recommendedItem) => {
                  return await this.trainingRecommendedEmployeeService.addTrainingRecommendedEmployee(
                    {
                      trainingDistribution,
                      ...recommendedItem,
                    },
                    entityManager
                  );
                })
              );

              //return result training distribution
              return { trainingDistribution: trainingDistribution, recommendedEmployee: recommended };
            })
          );

          return {
            ...trainingDetails,
          };
        } else if (lspType == LspType.ORGANIZATION) {
          //insert training details
          const trainingDetails = await this.crudService.transact<TrainingDetails>(entityManager).create({
            dto: {
              ...rest,
              courseContent: JSON.stringify(courseContent),
              postTrainingRequirements: JSON.stringify(postTrainingRequirements),
            },
            onError: ({ error }) => {
              return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
            },
          });

          //find learning service provider details
          const lspOrganizationDetails = await this.lspOrganizationDetailsService
            .crud()
            .transact<LspOrganizationDetails>(entityManager)
            .findOneBy({
              findBy: { id: lspDetails },
              onError: ({ error }) => {
                return new HttpException(error, HttpStatus.NOT_FOUND, { cause: error as Error });
              },
            });

          //insert training learning service provider individual
          const lsp = await this.trainingLspOrganizationService.addTrainingLspOrganization(
            {
              trainingDetails,
              lspOrganizationDetails,
            },
            entityManager
          );

          //insert multiple tags in a training
          const tag = await Promise.all(
            trainingTags.map(async (tagItem) => {
              return await this.trainingTagsService.addTrainingTag(
                {
                  trainingDetails,
                  ...tagItem,
                },
                entityManager
              );
            })
          );

          //insert slot distribution and recommended employee in a training
          const distribution = await Promise.all(
            //map slot distribution
            slotDistribution.map(async (slotDistributionItem) => {
              //deconstruct slot distribution dto
              const { recommendedEmployee, ...rest } = slotDistributionItem;

              //insert training distribution
              const trainingDistribution = await this.trainingDistributionsService.addTrainingDistribution(
                {
                  trainingDetails,
                  ...rest,
                },
                entityManager
              );

              //insert recommended employee
              const recommended = await Promise.all(
                recommendedEmployee.map(async (recommendedItem) => {
                  return await this.trainingRecommendedEmployeeService.addTrainingRecommendedEmployee(
                    {
                      trainingDistribution,
                      ...recommendedItem,
                    },
                    entityManager
                  );
                })
              );

              //return result training distribution
              return { trainingDistribution: trainingDistribution, recommendedEmployee: recommended };
            })
          );

          return {
            ...trainingDetails,
          };
        } else {
          throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
        }
      });

      return result;
    } catch (error) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  //get training details by id
  async getTrainingDetailsById(trainingId: string) {
    try {
      //find training details by training id and deconstruct
      const { courseContent, ...rest } = await this.crudService.findOne({
        find: {
          relations: { trainingSource: true, trainingType: true },
          select: {
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
            id: true,
            location: true,
            courseTitle: true,
            trainingStart: true,
            trainingEnd: true,
            numberOfHours: true,
            deadlineForSubmission: true,
            invitationUrl: true,
            numberOfParticipants: true,
            courseContent: true,
            status: true,
            trainingSource: {
              name: true,
            },
            trainingType: {
              name: true,
            },
          },
          where: { id: trainingId },
        },
      });

      //get all training tags by training id
      const tag = await this.trainingTagsService.crud().findAll({
        find: {
          relations: { tag: true },
          select: { id: true, tag: { name: true } },
          where: { trainingDetails: { id: trainingId } },
        },
      });

      //return result and parse course content and nominee qualifications
      return {
        ...rest,
        courseContent: JSON.parse(courseContent),
        nomineeQualifications: tag,
      };
    } catch (error) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  //update training details
  async updateTrainingDetails(dto: UpdateTrainingDetailsDto) {
    try {
      //transaction results
      const result = await this.datasource.transaction(async (entityManager) => {
        //deconstruct dto
        const { id, courseContent, postTrainingRequirements, ...rest } = dto;

        //update training details by training id
        const training = await this.crudService.transact<TrainingDetails>(entityManager).update({
          dto: {
            ...rest,
            courseContent: JSON.stringify(courseContent),
            postTrainingRequirements: JSON.stringify(postTrainingRequirements),
          },
          updateBy: { id },
          onError: ({ error }) => {
            return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
          },
        });

        return training;
      });

      //return update training details transaction result
      return result;
    } catch (error) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteTrainingDetails(trainingId: string): Promise<DeleteResult> {
    try {
      //transaction result
      const result = await this.datasource.transaction(async (entityManager) => {
        //delete all learning service provider child
        //const lspChilds = await this.deleteAllLspDetailsChild(lspDetailsId, entityManager);

        const lspIndividualDetails = await this.trainingLspIndividualService
          .crud()
          .transact<TrainingLspIndividual>(entityManager)
          .delete({
            softDelete: false,
            deleteBy: { trainingDetails: { id: trainingId } },
          });

        const lspOrganizationDetails = await this.trainingLspOrganizationService
          .crud()
          .transact<TrainingLspOrganization>(entityManager)
          .delete({
            softDelete: false,
            deleteBy: { trainingDetails: { id: trainingId } },
          });

        const trainingTags = await this.trainingTagsService
          .crud()
          .transact<TrainingTag>(entityManager)
          .delete({
            softDelete: false,
            deleteBy: { trainingDetails: { id: trainingId } },
          });

        const distributions = (await this.trainingDistributionsService
          .crud()
          .transact<TrainingDistribution>(entityManager)
          .findAll({
            find: { where: { trainingDetails: { id: trainingId } } },
          })) as TrainingDistribution[];

        const recommendedEmployee = await Promise.all(
          distributions.map(async (distributionItem) => {
            return await this.trainingRecommendedEmployeeService
              .crud()
              .transact<TrainingRecommendedEmployee>(entityManager)
              .delete({ softDelete: false, deleteBy: { trainingDistribution: distributionItem } });
          })
        );

        const trainingDistribution = await this.trainingDistributionsService
          .crud()
          .transact<TrainingDistribution>(entityManager)
          .delete({
            softDelete: false,
            deleteBy: { trainingDetails: { id: trainingId } },
          });

        //delete training details
        const trainingDetails = await this.crudService
          .transact<TrainingDetails>(entityManager)
          .delete({ softDelete: false, deleteBy: { id: trainingId } });

        return trainingDetails;
        //if (lspChilds.affected > 0 && lspDetails.affected > 0) return lspDetails;
      });

      //return result
      return result;
    } catch (error) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }
}
