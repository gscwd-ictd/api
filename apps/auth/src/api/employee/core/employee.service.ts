import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';
import { Employee } from '../data/employee.entity';

@Injectable()
export class EmployeeService extends CrudHelper<Employee> {
  constructor(private readonly crudService: CrudService<Employee>) {
    super(crudService);
  }
}
