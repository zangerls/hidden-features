import { z } from "zod";

const imageSchema = z.object({
  url: z.string(),
  height: z.number().int().nonnegative(),
  width: z.number().int().nonnegative(),
});

export const artistSchema = z.object({
  id: z.string(),
  name: z.string(),
  followers: z.object({
    total: z.number().int().nonnegative(),
  }),
  genres: z.array(z.string()),
  images: z.array(imageSchema),
});

export const artistsDataSchema = z.object({
  artists: z.object({
    total: z.number(),
    items: z.array(artistSchema),
  }),
});
