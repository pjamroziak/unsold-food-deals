import { createZodDto } from 'nestjs-zod';
import {
  OptionalIdSchema,
  OptionalUserSchema,
  PaginationRequestSchema,
  UserSchema,
} from '../schemas';

export class FindUserDto extends createZodDto(
  OptionalIdSchema.merge(UserSchema.merge(PaginationRequestSchema))
) {}
export class CreateUserDto extends createZodDto(UserSchema) {}
export class UpdateUserDto extends createZodDto(OptionalUserSchema) {}
