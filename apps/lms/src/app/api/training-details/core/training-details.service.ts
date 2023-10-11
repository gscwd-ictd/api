import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrainingExternalDto, CreateTrainingInternalDto, TrainingDetails, TrainingDistribution, TrainingTag } from '@gscwd-api/models';
import { DataSource } from 'typeorm';
import { TrainingTagsService } from '../components/training-tags';
import { TrainingDistributionsService } from '../components/training-distributions';
import { TrainingRecommendedEmployeeService } from '../components/training-recommended-employees';

@Injectable()
export class TrainingDetailsService extends CrudHelper<TrainingDetails> {
  constructor(
    private readonly crudService: CrudService<TrainingDetails>,
    private readonly trainingTagsService: TrainingTagsService,
    private readonly trainingDistributionsService: TrainingDistributionsService,
    private readonly trainingRecommendedEmployeesService: TrainingRecommendedEmployeeService,
    private readonly datasource: DataSource
  ) {
    super(crudService);
  }

  // training internal
  async addTrainingInternal(data: CreateTrainingInternalDto) {
    const { courseContent, trainingRequirements, trainingTags, slotDistribution, ...rest } = data;
    try {
      const result = await this.datasource.transaction(async (entityManager) => {
        const trainingDetails = await this.crudService.create({
          dto: {
            courseContent: JSON.stringify(courseContent),
            trainingRequirements: JSON.stringify(trainingRequirements),
            ...rest,
          },
          onError: () => new BadRequestException(),
        });

        //insert training tags
        await Promise.all(
          trainingTags.map(async (trainingTagsItem) => {
            return await this.trainingTagsService.create(
              {
                trainingDetails,
                ...trainingTagsItem,
              },
              entityManager
            );
          })
        );

        //insert training slot distributions
        await Promise.all(
          slotDistribution.map(async (slotDistributionsItem) => {
            return await this.trainingDistributionsService.create(
              {
                trainingDetails,
                ...slotDistributionsItem,
              },
              entityManager
            );
          })
        );

        return data;
      });

      return result;
    } catch (error) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  // training external
  async addTrainingExternal(data: CreateTrainingExternalDto) {
    const { courseContent, trainingRequirements, bucketFiles, trainingTags, slotDistribution, ...rest } = data;
    try {
      const result = await this.datasource.transaction(async (entityManager) => {
        const trainingDetails = await this.crudService.create({
          dto: {
            courseContent: JSON.stringify(courseContent),
            trainingRequirements: JSON.stringify(trainingRequirements),
            bucketFiles: JSON.stringify(bucketFiles),
            ...rest,
          },
          onError: () => new BadRequestException(),
        });

        //insert training tags
        await Promise.all(
          trainingTags.map(async (trainingTagsItem) => {
            return await this.trainingTagsService.create(
              {
                trainingDetails,
                ...trainingTagsItem,
              },
              entityManager
            );
          })
        );

        //insert training slot distributions
        await Promise.all(
          slotDistribution.map(async (slotDistributionsItem) => {
            return await this.trainingDistributionsService.create(
              {
                trainingDetails,
                ...slotDistributionsItem,
              },
              entityManager
            );
          })
        );

        return data;
      });

      return result;
    } catch (error) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  // get training details by id
  async getTrainingById(id: string) {
    try {
      const trainingDetails = await this.crudService.findOne({
        find: {
          relations: { trainingDesign: true, trainingSource: true },
          select: {
            id: true,
            trainingDesign: { id: true, courseTitle: true },
            courseTitle: true,
            courseContent: true,
            location: true,
            trainingStart: true,
            trainingEnd: true,
            numberOfHours: true,
            deadlineForSubmission: true,
            numberOfParticipants: true,
            trainingRequirements: true,
            bucketFiles: true,
            trainingSource: { id: true, name: true },
            trainingType: true,
          },
          where: { id: id },
        },
        onError: () => new NotFoundException(),
      });

      const tag = (await this.trainingTagsService.crud().findAll({
        find: { relations: { tag: true }, select: { id: true, tag: { name: true } }, where: { trainingDetails: { id } } },
      })) as TrainingTag[];

      const traingTags = await Promise.all(
        tag.map(async (tagItem) => {
          return {
            tag: tagItem.tag.name,
          };
        })
      );

      const distribution = (await this.trainingDistributionsService.crud().findAll({
        find: { select: { id: true, supervisorId: true, numberOfSlots: true }, where: { trainingDetails: { id } } },
      })) as TrainingDistribution[];

      const slotDistribution = await Promise.all(
        distribution.map(async (distributionItem) => {
          const recommended = await this.trainingRecommendedEmployeesService
            .crud()
            .findAll({ find: { select: { employeeId: true }, where: { trainingDistribution: { id: distributionItem.id } } } });

          return {
            supervisor: {
              supervisorId: distributionItem.supervisorId,
            },
            numberOfSlots: distributionItem.numberOfSlots,
            recommended,
          };
        })
      );

      return {
        id: trainingDetails.id,
        trainingDesign: trainingDetails.trainingDesign.id,
        courseTitle: trainingDetails.courseTitle || trainingDetails.trainingDesign.courseTitle,
        courseContent: JSON.parse(trainingDetails.courseContent),
        location: trainingDetails.location,
        trainingStart: trainingDetails.trainingStart,
        trainingEnd: trainingDetails.trainingEnd,
        numberOfHours: trainingDetails.numberOfHours,
        deadlineForSubmission: trainingDetails.deadlineForSubmission,
        numberOfParticipants: trainingDetails.numberOfParticipants,
        trainingRequirements: JSON.parse(trainingDetails.trainingRequirements),
        bucketFiles: JSON.parse(trainingDetails.bucketFiles),
        trainingSource: trainingDetails.trainingSource.name,
        trainingType: trainingDetails.trainingType,
        traingTags,
        slotDistribution,
      };
    } catch (error) {
      throw new NotFoundException();
    }
  }

  // async getTrainingExternal(id: string) {
  //   try {
  //     const trainingDetails = await this.crudService.findOne({
  //       find: {
  //         select: {
  //           id: true,
  //           courseTitle: true,
  //           courseContent: true,
  //           location: true,
  //           trainingStart: true,
  //           trainingEnd: true,
  //           numberOfHours: true,
  //           deadlineForSubmission: true,
  //           numberOfParticipants: true,
  //           trainingRequirements: true,
  //           bucketFiles: true,
  //         },
  //         where: { id: id },
  //       },
  //       onError: () => new NotFoundException(),
  //     });
  //   } catch (error) {
  //     throw new NotFoundException();
  //   }
  // }

  //HR create training individual details and distribute slots to selected managers

  // async addTrainingDetails(lspType: LspType, data: CreateTrainingDetailsDto) {
  //   //disconstruct dto
  //   const { courseContent, postTrainingRequirements, lspDetails, trainingTags, slotDistribution, ...rest } = data;

  //   try {
  //     //transaction result
  //     const result = await this.datasource.transaction(async (entityManager) => {
  //       //condition if learning service provider is individual or organization
  //       if (lspType === LspType.INDIVIDUAL) {
  //         //insert training details
  //         const trainingDetails = await this.crudService.transact<TrainingDetails>(entityManager).create({
  //           dto: {
  //             ...rest,
  //             courseContent: JSON.stringify(courseContent),
  //             postTrainingRequirements: JSON.stringify(postTrainingRequirements),
  //           },
  //           onError: ({ error }) => {
  //             return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
  //           },
  //         });

  //         //find learning service provider details
  //         const lspIndividualDetails = await this.lspIndividualDetailsService
  //           .crud()
  //           .transact<LspIndividualDetails>(entityManager)
  //           .findOneBy({
  //             findBy: { id: lspDetails },
  //             onError: ({ error }) => {
  //               return new HttpException(error, HttpStatus.NOT_FOUND, { cause: error as Error });
  //             },
  //           });

  //         //insert training learning service provider individual
  //         const lsp = await this.trainingLspIndividualService.addTrainingLspIndividual(
  //           {
  //             trainingDetails,
  //             lspIndividualDetails,
  //           },
  //           entityManager
  //         );

  //         //insert multiple tags in a training
  //         const tag = await Promise.all(
  //           trainingTags.map(async (tagItem) => {
  //             return await this.trainingTagsService.addTrainingTag(
  //               {
  //                 trainingDetails,
  //                 ...tagItem,
  //               },
  //               entityManager
  //             );
  //           })
  //         );

  //         //insert slot distribution and recommended employee in a training
  //         const distribution = await Promise.all(
  //           //map slot distribution
  //           slotDistribution.map(async (slotDistributionItem) => {
  //             //deconstruct slot distribution dto
  //             const { recommendedEmployee, ...rest } = slotDistributionItem;

  //             //insert training distribution
  //             const trainingDistribution = await this.trainingDistributionsService.addTrainingDistribution(
  //               {
  //                 trainingDetails,
  //                 ...rest,
  //               },
  //               entityManager
  //             );

  //             //insert recommended employee
  //             const recommended = await Promise.all(
  //               recommendedEmployee.map(async (recommendedItem) => {
  //                 return await this.trainingRecommendedEmployeeService.addTrainingRecommendedEmployee(
  //                   {
  //                     trainingDistribution,
  //                     ...recommendedItem,
  //                   },
  //                   entityManager
  //                 );
  //               })
  //             );

  //             //return result training distribution
  //             return { trainingDistribution: trainingDistribution, recommendedEmployee: recommended };
  //           })
  //         );

  //         return {
  //           ...trainingDetails,
  //         };
  //       } else if (lspType == LspType.ORGANIZATION) {
  //         //insert training details
  //         const trainingDetails = await this.crudService.transact<TrainingDetails>(entityManager).create({
  //           dto: {
  //             ...rest,
  //             courseContent: JSON.stringify(courseContent),
  //             postTrainingRequirements: JSON.stringify(postTrainingRequirements),
  //           },
  //           onError: ({ error }) => {
  //             return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
  //           },
  //         });

  //         //find learning service provider details
  //         const lspOrganizationDetails = await this.lspOrganizationDetailsService
  //           .crud()
  //           .transact<LspOrganizationDetails>(entityManager)
  //           .findOneBy({
  //             findBy: { id: lspDetails },
  //             onError: ({ error }) => {
  //               return new HttpException(error, HttpStatus.NOT_FOUND, { cause: error as Error });
  //             },
  //           });

  //         //insert training learning service provider individual
  //         const lsp = await this.trainingLspOrganizationService.addTrainingLspOrganization(
  //           {
  //             trainingDetails,
  //             lspOrganizationDetails,
  //           },
  //           entityManager
  //         );

  //         //insert multiple tags in a training
  //         const tag = await Promise.all(
  //           trainingTags.map(async (tagItem) => {
  //             return await this.trainingTagsService.addTrainingTag(
  //               {
  //                 trainingDetails,
  //                 ...tagItem,
  //               },
  //               entityManager
  //             );
  //           })
  //         );

  //         //insert slot distribution and recommended employee in a training
  //         const distribution = await Promise.all(
  //           //map slot distribution
  //           slotDistribution.map(async (slotDistributionItem) => {
  //             //deconstruct slot distribution dto
  //             const { recommendedEmployee, ...rest } = slotDistributionItem;

  //             //insert training distribution
  //             const trainingDistribution = await this.trainingDistributionsService.addTrainingDistribution(
  //               {
  //                 trainingDetails,
  //                 ...rest,
  //               },
  //               entityManager
  //             );

  //             //insert recommended employee
  //             const recommended = await Promise.all(
  //               recommendedEmployee.map(async (recommendedItem) => {
  //                 return await this.trainingRecommendedEmployeeService.addTrainingRecommendedEmployee(
  //                   {
  //                     trainingDistribution,
  //                     ...recommendedItem,
  //                   },
  //                   entityManager
  //                 );
  //               })
  //             );

  //             //return result training distribution
  //             return { trainingDistribution: trainingDistribution, recommendedEmployee: recommended };
  //           })
  //         );

  //         return {
  //           ...trainingDetails,
  //         };
  //       } else {
  //         throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
  //       }
  //     });

  //     return result;
  //   } catch (error) {
  //     throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
  //   }
  // }

  // //get training details by id
  // async getTrainingDetailsById(trainingId: string) {
  //   try {
  //     //find training details by training id and deconstruct
  //     const { courseContent, ...rest } = await this.crudService.findOne({
  //       find: {
  //         relations: { trainingSource: true, trainingType: true },
  //         select: {
  //           createdAt: true,
  //           updatedAt: true,
  //           deletedAt: true,
  //           id: true,
  //           location: true,
  //           courseTitle: true,
  //           trainingStart: true,
  //           trainingEnd: true,
  //           numberOfHours: true,
  //           deadlineForSubmission: true,
  //           invitationUrl: true,
  //           numberOfParticipants: true,
  //           courseContent: true,
  //           status: true,
  //           trainingSource: {
  //             name: true,
  //           },
  //           trainingType: {
  //             name: true,
  //           },
  //         },
  //         where: { id: trainingId },
  //       },
  //     });

  //     //get all training tags by training id
  //     const tag = await this.trainingTagsService.crud().findAll({
  //       find: {
  //         relations: { tag: true },
  //         select: { id: true, tag: { name: true } },
  //         where: { trainingDetails: { id: trainingId } },
  //       },
  //     });

  //     //return result and parse course content and nominee qualifications
  //     return {
  //       ...rest,
  //       courseContent: JSON.parse(courseContent),
  //       nomineeQualifications: tag,
  //     };
  //   } catch (error) {
  //     throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  //   }
  // }

  // //update training details
  // async updateTrainingDetails(dto: UpdateTrainingDetailsDto) {
  //   try {
  //     //transaction results
  //     const result = await this.datasource.transaction(async (entityManager) => {
  //       //deconstruct dto
  //       const { id, courseContent, postTrainingRequirements, ...rest } = dto;

  //       //update training details by training id
  //       const training = await this.crudService.transact<TrainingDetails>(entityManager).update({
  //         dto: {
  //           ...rest,
  //           courseContent: JSON.stringify(courseContent),
  //           postTrainingRequirements: JSON.stringify(postTrainingRequirements),
  //         },
  //         updateBy: { id },
  //         onError: ({ error }) => {
  //           return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
  //         },
  //       });

  //       return training;
  //     });

  //     //return update training details transaction result
  //     return result;
  //   } catch (error) {
  //     throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
  //   }
  // }

  // async deleteTrainingDetails(trainingId: string): Promise<DeleteResult> {
  //   try {
  //     //transaction result
  //     const result = await this.datasource.transaction(async (entityManager) => {
  //       //delete all learning service provider child
  //       //const lspChilds = await this.deleteAllLspDetailsChild(lspDetailsId, entityManager);

  //       const lspIndividualDetails = await this.trainingLspIndividualService
  //         .crud()
  //         .transact<TrainingLspIndividual>(entityManager)
  //         .delete({
  //           softDelete: false,
  //           deleteBy: { trainingDetails: { id: trainingId } },
  //         });

  //       const lspOrganizationDetails = await this.trainingLspOrganizationService
  //         .crud()
  //         .transact<TrainingLspOrganization>(entityManager)
  //         .delete({
  //           softDelete: false,
  //           deleteBy: { trainingDetails: { id: trainingId } },
  //         });

  //       const trainingTags = await this.trainingTagsService
  //         .crud()
  //         .transact<TrainingTag>(entityManager)
  //         .delete({
  //           softDelete: false,
  //           deleteBy: { trainingDetails: { id: trainingId } },
  //         });

  //       const distributions = (await this.trainingDistributionsService
  //         .crud()
  //         .transact<TrainingDistribution>(entityManager)
  //         .findAll({
  //           find: { where: { trainingDetails: { id: trainingId } } },
  //         })) as TrainingDistribution[];

  //       const recommendedEmployee = await Promise.all(
  //         distributions.map(async (distributionItem) => {
  //           return await this.trainingRecommendedEmployeeService
  //             .crud()
  //             .transact<TrainingRecommendedEmployee>(entityManager)
  //             .delete({ softDelete: false, deleteBy: { trainingDistribution: distributionItem } });
  //         })
  //       );

  //       const trainingDistribution = await this.trainingDistributionsService
  //         .crud()
  //         .transact<TrainingDistribution>(entityManager)
  //         .delete({
  //           softDelete: false,
  //           deleteBy: { trainingDetails: { id: trainingId } },
  //         });

  //       //delete training details
  //       const trainingDetails = await this.crudService
  //         .transact<TrainingDetails>(entityManager)
  //         .delete({ softDelete: false, deleteBy: { id: trainingId } });

  //       return trainingDetails;
  //       //if (lspChilds.affected > 0 && lspDetails.affected > 0) return lspDetails;
  //     });

  //     //return result
  //     return result;
  //   } catch (error) {
  //     throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
  //   }
  // }
}
