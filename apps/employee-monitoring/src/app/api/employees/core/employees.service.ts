import { MicroserviceClient } from '@gscwd-api/microservices';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmployeesService {
  constructor(private readonly client: MicroserviceClient) {}

  async getAllPermanentEmployeeIds() {}
}
