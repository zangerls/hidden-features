import { artistSchema } from "@/schemas/spotify";
import { z } from "zod";

export type Artist = z.infer<typeof artistSchema>;
