import { createZodDto } from 'nestjs-zod';
import { CordinatesSchema } from '../schemas';

export class CordinatesDto extends createZodDto(CordinatesSchema) {}
