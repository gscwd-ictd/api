import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingDetailsDto, LspIndividualDetails, LspOrganizationDetails, TrainingDetails, UpdateTrainingDetailsDto } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TrainingDistributionsService } from '../components/training-distributions';
import { TrainingTagsService } from '../components/training-tags';
import { LspIndividualDetailsService } from '../../lsp-individual-details';
import { LspOrganizationDetailsService } from '../../lsp-organization-details';
import { TrainingLspIndividualService } from '../components/training-lsp-individual';
import { TrainingLspOrganizationService } from '../components/training-lsp-organization';

@Injectable()
export class TrainingDetailsService extends CrudHelper<TrainingDetails> {
  constructor(
    private readonly crudService: CrudService<TrainingDetails>,
    private readonly trainingDistributionsService: TrainingDistributionsService,
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

  //insert training with individual learning service provider
  async addTrainingLspIndividual(data: CreateTrainingDetailsDto) {
    //deconstruct dto
    const { lspDetails, courseContent, recommendedEmployee, trainingDistribution, postTrainingRequirements, trainingTags, ...rest } = data;
    try {
      //transaction results
      const results = await this.datasource.transaction(async (entityManager) => {
        //insert training details
        const trainingDetails = await this.crudService.transact<TrainingDetails>(entityManager).create({
          dto: {
            ...rest,
            courseContent: JSON.stringify(courseContent),
            recommendedEmployee: JSON.stringify(recommendedEmployee),
            postTrainingRequirements: JSON.stringify(postTrainingRequirements),
          },
          onError: ({ error }) => {
            return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
          },
        });

        //find lsp individual details
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

        //insert multiple and map training tag
        const tag = await Promise.all(
          trainingTags.map(async (tagItem) => {
            return await this.trainingTagsService.addTrainingTag(
              {
                trainingDetails: trainingDetails,
                ...tagItem,
              },
              entityManager
            );
          })
        );

        //insert multiple and map selected managers and given number of slots
        const distribution = await Promise.all(
          trainingDistribution.map(async (distributionItem) => {
            return await this.trainingDistributionsService.addTrainingDistribution(
              {
                trainingDetails: trainingDetails,
                ...distributionItem,
              },
              entityManager
            );
          })
        );

        return {
          ...trainingDetails,
          lspDetails: lsp.id,
          courseContent: JSON.parse(trainingDetails.courseContent),
          recommendedEmployee: JSON.parse(trainingDetails.recommendedEmployee),
          trainingTag: tag,
          trainingDistribution: distribution,
        };
      });

      //return training training and distribution transaction result
      return results;
    } catch (error) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  //insert training with learning service provider organization
  async addTrainingLspOrganization(data: CreateTrainingDetailsDto) {
    //deconstruct dto
    const { lspDetails, courseContent, recommendedEmployee, trainingDistribution, postTrainingRequirements, trainingTags, ...rest } = data;

    try {
      //transaction results
      const results = await this.datasource.transaction(async (entityManager) => {
        //insert training details
        const trainingDetails = await this.crudService.transact<TrainingDetails>(entityManager).create({
          dto: {
            ...rest,
            courseContent: JSON.stringify(courseContent),
            recommendedEmployee: JSON.stringify(recommendedEmployee),
            postTrainingRequirements: JSON.stringify(postTrainingRequirements),
          },
          onError: ({ error }) => {
            return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
          },
        });

        // find lsp organization details
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

        //insert multiple and map training tag
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

        //insert multiple and map selected managers and given number of slots
        const distribution = await Promise.all(
          trainingDistribution.map(async (distributionItem) => {
            return await this.trainingDistributionsService.addTrainingDistribution(
              {
                trainingDetails,
                ...distributionItem,
              },
              entityManager
            );
          })
        );

        return {
          ...trainingDetails,
          lspDetails: lsp.id,
          courseContent: JSON.parse(trainingDetails.courseContent),
          recommendedEmployee: JSON.parse(trainingDetails.recommendedEmployee),
          trainingTag: tag,
          trainingDistribution: distribution,
        };
      });

      //return training training and distribution transaction result
      return results;
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

  // async getNomineeByTrainingId(trainingId: string) {
  //   try {
  //     const results = await this.trainingNomineesService.crud().findAll({
  //       find: {
  //         relations: { trainingDistribution: true },
  //         select: { trainingDistribution: { employeeId: true } },
  //         where: { trainingDistribution: { training: { id: trainingId } } },
  //       },
  //     });
  //     return results;
  //   } catch (error) {
  //     throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  //   }
  // }

  //update training details
  async updateTrainingDetails(dto: UpdateTrainingDetailsDto) {
    try {
      //transaction results
      const result = await this.datasource.transaction(async (entityManager) => {
        //deconstruct dto
        const { id, courseContent, recommendedEmployee, postTrainingRequirements, ...rest } = dto;

        //update training details by training id
        const training = await this.crudService.transact<TrainingDetails>(entityManager).update({
          dto: {
            ...rest,
            courseContent: JSON.stringify(courseContent),
            recommendedEmployee: JSON.stringify(recommendedEmployee),
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
}
