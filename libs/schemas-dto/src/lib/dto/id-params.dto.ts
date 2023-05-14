import { createZodDto } from 'nestjs-zod';
import { IdSchema } from '../schemas';

export class IdParamsDto extends createZodDto(IdSchema) {}
