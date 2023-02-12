import { HttpException, HttpStatus } from '@nestjs/common';

export class ClientNotFoundException extends HttpException {
  constructor(params: any) {
    super(`Client not found | ${{ ...params }}`, HttpStatus.NOT_FOUND);
  }
}
