import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor(params: any) {
    super(`User not found | ${{ ...params }}`, HttpStatus.NOT_FOUND);
  }
}
