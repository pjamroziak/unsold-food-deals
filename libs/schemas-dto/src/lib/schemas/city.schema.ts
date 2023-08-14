import { z } from 'nestjs-zod/z';
import { PaginationResponseSchema } from './pagination.schema';
import { IdSchema } from './id.schema';

export enum SupportedApp {
  Foodsi = 'foodsi',
  TooGoodToGo = 'tgtg',
}

export const CitySchema = z.object({
  name: z.string().max(30),
  latitude: z.number(),
  longitude: z.number(),
  radiusInKm: z.number().positive().min(1).max(30),
  supportedApps: z
    .array(z.nativeEnum(SupportedApp))
    .min(1)
    .default([SupportedApp.Foodsi]),
});

export const OptionalCitySchema = z.object({
  name: z.string().max(30).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  radiusInKm: z.number().positive().min(1).max(30).optional(),
  supportedApps: z
    .array(z.nativeEnum(SupportedApp))
    .min(1)
    .default([SupportedApp.Foodsi])
    .optional(),
});

export const PaginatedCitySchema = PaginationResponseSchema.merge(
  z.object({
    results: z.array(z.from(IdSchema.merge(CitySchema))),
  })
);
