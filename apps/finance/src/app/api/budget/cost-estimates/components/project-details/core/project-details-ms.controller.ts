import { Controller } from '@nestjs/common';
import { ProjectDetailsService } from './project-details.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProjectDetailsPatterns } from '@gscwd-api/microservices';

@Controller()
export class ProjectDetailsMicroserviceController {
  constructor(private readonly projectDetailsService: ProjectDetailsService) {}

  @MessagePattern(ProjectDetailsPatterns.FIND_BY_ID)
  async findProjectById(@Payload('id') id: string) {
    return await this.projectDetailsService.crud().findOneBy({
      findBy: { id },
    });
  }
}
