import { EquipmentCost, LaborCost, MaterialCost, ProjectDetails } from '@gscwd-api/models';
import { keysToCamel, keysToSnake, RawCostEstimate } from '@gscwd-api/utils';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { DataSource } from 'typeorm';
import { ItemService } from '../../../../services/item';
import { CreateCostEstimateDto } from '../data/cost-estimates.dto';

@Injectable()
export class CostEstimateService {
  constructor(private readonly datasource: DataSource, private readonly itemService: ItemService) {}

  async createCostEstimate(costEstimateDto: CreateCostEstimateDto): Promise<RawCostEstimate> {
    const {
      budgetDetails: { budgetType, generalLedgerAccount },
      projectDetails: { projectName, location, subject, workDescription, quantity, unitMeasurement, outputPerDay },
      materialCost,
      laborCost,
      equipmentCost,
    } = costEstimateDto;

    try {
      const result = await this.datasource.query(
        'SELECT * FROM create_budget($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) as project_details_id',
        [
          budgetType,
          generalLedgerAccount,
          projectName,
          location,
          subject,
          workDescription,
          quantity,
          unitMeasurement,
          outputPerDay,
          JSON.stringify(keysToSnake(materialCost)),
          JSON.stringify(keysToSnake(laborCost)),
          JSON.stringify(keysToSnake(equipmentCost)),
        ]
      );

      return keysToCamel(result[0]);
    } catch (error) {
      throw new BadRequestException(error, { cause: new Error() });
    }
  }

  async findAll({ page, limit }: IPaginationOptions) {
    return await paginate(
      this.datasource.getRepository(ProjectDetails),
      { page, limit },
      {
        relations: { budgetDetails: { budgetType: true, generalLedgerAccount: true } },
        select: {
          budgetDetails: {
            status: true,
            budgetType: { name: true },
            generalLedgerAccount: { name: true },
          },
        },
      }
    );
  }

  async findById(id: string) {
    try {
      const projectDetails = await this.datasource.getRepository(ProjectDetails).findOne({
        relations: { budgetDetails: { budgetType: true, generalLedgerAccount: true } },
        select: { budgetDetails: { status: true, budgetType: { id: true, name: true }, generalLedgerAccount: { id: true, name: true } } },
        where: { id },
      });

      const materialCost = await this.datasource
        .getRepository(MaterialCost)
        .find({ select: { id: true, specificationId: true, quantity: true, unitCost: true }, where: { projectDetails: { id } } });

      const modifiedMaterialCost = await Promise.all(
        materialCost.map(async (material) => {
          const item = await this.itemService.findItemFromViewById(material.specificationId);
          console.log(item);
          return {
            materialId: material.id,
            id: item.id,
            code: item.code,
            item: item.specifications.item,
            details: item.specifications.details,
            unit: item.specifications.unit.name,
            quantity: material.quantity,
            unitCost: material.unitCost,
            amount: material.quantity * material.unitCost,
          };
        })
      );

      const laborCost = await this.datasource.getRepository(LaborCost).find({
        select: { id: true, specificationId: true, numberOfPerson: true, numberOfDays: true, unitCost: true },
        where: { projectDetails: { id } },
      });

      const modifiedLaborCost = await Promise.all(
        laborCost.map(async (labor) => {
          const item = await this.itemService.findItemFromViewById(labor.specificationId);
          return {
            laborId: labor.id,
            id: item.id,
            item: item.specifications.item,
            unit: item.specifications.unit.name,
            numberOfPerson: labor.numberOfPerson,
            numberOfDays: labor.numberOfDays,
            unitCost: labor.unitCost,
            amount: labor.numberOfPerson * labor.numberOfDays * labor.unitCost,
          };
        })
      );

      const equipmentCost = await this.datasource.getRepository(EquipmentCost).find({
        select: {
          equipmentDescription: true,
          numberOfUnit: true,
          numberOfDays: true,
          unitCost: true,
        },
        where: { projectDetails: { id } },
      });

      const modifiedEquipmentCost = await Promise.all(
        equipmentCost.map(async (equipment) => {
          return {
            equipmentId: equipment.id,
            equipmentDescription: equipment.equipmentDescription,
            numberOfUnit: equipment.numberOfUnit,
            numberOfDays: equipment.numberOfDays,
            unitCost: equipment.unitCost,
            total: equipment.numberOfDays * equipment.numberOfUnit * equipment.unitCost,
          };
        })
      );

      return { projectDetails, materialCost: modifiedMaterialCost, laborCost: modifiedLaborCost, equipmentCost: modifiedEquipmentCost };
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
