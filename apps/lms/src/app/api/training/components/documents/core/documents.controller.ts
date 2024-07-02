import { Controller, Get, Param } from '@nestjs/common';
import { DocumentsService } from './documents.service';

@Controller({ version: '1', path: 'documents' })
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get(':trainingId')
  async approvalDocuments(@Param('trainingId') trainingId: string) {
    return await this.documentsService.approvalDocuments(trainingId);
  }
}
