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

export const albumSchema = z.object({
  id: z.string(),
  name: z.string(),
  album_type: z.union([
    z.literal("album"),
    z.literal("single"),
    z.literal("compilation"),
  ]),
  total_tracks: z.number().int().nonnegative(),
  images: z.array(imageSchema),
  release_date: z.string(),
  release_date_precision: z.union([
    z.literal("year"),
    z.literal("month"),
    z.literal("day"),
  ]),
});

export const simplifiedAlbumSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const albumsDataSchema = z.object({
  next: z.nullable(z.string()),
  total: z.number().int().nonnegative(),
  items: z.array(albumSchema),
});

export const simplifiedArtistSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const trackSchema = z.object({
  id: z.string(),
  name: z.string(),
  artists: z.array(simplifiedArtistSchema),
  duration_ms: z.number().int().nonnegative(),
  track_number: z.number().int().nonnegative(),
});

export const tracksDataSchema = z.object({
  next: z.nullable(z.string()),
  total: z.number().int().nonnegative(),
  items: z.array(trackSchema),
});
