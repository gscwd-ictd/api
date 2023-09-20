import { BadRequestException, Controller, Delete, Param } from '@nestjs/common';
import { LspDetailsService } from './lsp-details.service';
import { DeleteResult } from 'typeorm';

@Controller({ version: '1', path: 'lsp-details' })
export class LspDetailsController {
  constructor(private readonly lspDetailsService: LspDetailsService) {}

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.lspDetailsService.crud().delete({
      deleteBy: { id },
      softDelete: false,
      onError: () => new BadRequestException(),
    });
  }
}
