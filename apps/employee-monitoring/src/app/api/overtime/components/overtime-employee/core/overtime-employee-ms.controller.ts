import { DeleteOvertimeEmployeeByImmediateSupervisorDto, DeleteOvertimeEmployeeByManagerDto } from "@gscwd-api/models";
import { MsExceptionFilter } from "@gscwd-api/utils";
import { Controller, UseFilters } from "@nestjs/common";
import { MessagePattern, Payload, RpcException } from "@nestjs/microservices";
import { OvertimeEmployeeService } from "./overtime-employee.service";

@Controller()
export class OvertimeEmployeeMsController {
    constructor(private readonly overtimeEmployeeService: OvertimeEmployeeService) { }

    @UseFilters(new MsExceptionFilter())
    @MessagePattern('delete_overtime_employee_by_immediate_supervisor')
    async deleteOvertimeEmployee(@Payload() deleteOvertimeEmployeeDto: DeleteOvertimeEmployeeByImmediateSupervisorDto) {
        return await this.overtimeEmployeeService.deleteOvertimeEmployeeByImmediateSupervisorDto(deleteOvertimeEmployeeDto);
    }

    @UseFilters(new MsExceptionFilter())
    @MessagePattern('delete_overtime_employee_by_manager')
    async deleteOvertimeEmployeeByImmediateSupervisor(@Payload() deleteOvertimeEmployeeDto: DeleteOvertimeEmployeeByManagerDto) {
        return await this.overtimeEmployeeService.deleteOvertimeEmployeeByManager(deleteOvertimeEmployeeDto);
    }
}