import {
  albumSchema,
  artistSchema,
  simplifiedAlbumSchema,
  simplifiedArtistSchema,
  trackSchema,
} from "@/schemas/spotify";
import { z } from "zod";

export type Artist = z.infer<typeof artistSchema>;

export type Album = z.infer<typeof albumSchema>;

export type Track = z.infer<typeof trackSchema>;

export type SimplifiedArtist = z.infer<typeof simplifiedArtistSchema>;

export type SimplifiedAlbum = z.infer<typeof simplifiedAlbumSchema>;
