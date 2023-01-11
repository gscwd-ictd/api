import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class TestService {
  constructor(
    @Inject('TEST_MS')
    private readonly client: ClientProxy
  ) {}

  async test() {
    console.log(this.client);
  }
}
