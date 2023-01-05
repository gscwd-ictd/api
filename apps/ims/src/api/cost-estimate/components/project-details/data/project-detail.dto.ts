export class CreateProjectDetailDto {
  projectName: string;
  location: string;
  itemNumber: string;
  workDescription: string;
  quantity: number;
  outputPerDay: number;
}

export class UpdateProjectDetailDto extends CreateProjectDetailDto {}
