import { Controller } from '@nestjs/common';
import { RequestedItemService } from './requested-item.service';

@Controller({ version: '1', path: '/requested-items' })
export class RequestedItemController {
  constructor(private readonly requestedItemService: RequestedItemService) {}
}
