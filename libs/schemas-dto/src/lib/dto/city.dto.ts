import { createZodDto } from 'nestjs-zod';
import {
  CitySchema,
  IdSchema,
  OptionalCitySchema,
  OptionalIdSchema,
  PaginationRequestSchema,
} from '../schemas';

export class FindCityDto extends createZodDto(
  OptionalIdSchema.merge(OptionalCitySchema.merge(PaginationRequestSchema))
) {}
export class CreateCityDto extends createZodDto(CitySchema) {}
export class UpdateCityDto extends createZodDto(OptionalCitySchema) {}
