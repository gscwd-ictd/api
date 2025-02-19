import { CreateOvertimeEmployeeDto, DeleteOvertimeEmployeeDto } from "@gscwd-api/models";
import { MsExceptionFilter } from "@gscwd-api/utils";
import { Controller, UseFilters } from "@nestjs/common";
import { MessagePattern, Payload, RpcException } from "@nestjs/microservices";
import { OvertimeEmployeeService } from "./overtime-employee.service";

@Controller()
export class OvertimeEmployeeMsController {
    constructor(private readonly overtimeEmployeeService: OvertimeEmployeeService) { }

    @UseFilters(new MsExceptionFilter())
    @MessagePattern('delete_overtime_employee')
    async deleteOvertimeEmployee(@Payload() deleteOvertimeEmployeeDto: DeleteOvertimeEmployeeDto) {
        return await this.overtimeEmployeeService.deleteOvertimeEmployee(deleteOvertimeEmployeeDto);
    }
}