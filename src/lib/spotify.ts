import { z } from "zod";

/**
 * Requests a fresh acccess token for the Spotify API (valid for 1 hour)
 */
export async function getAccessToken(): Promise<string> {
  const tokenSchema = z.object({
    access_token: z.string(),
    token_type: z.literal("Bearer"),
    expires_in: z.number(),
  });

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.SPOTIFY_CLIENT_ID!,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
    }),
  });

  if (!res.ok) {
    throw new Error(`[${res.status}] - ${res.statusText}`);
  }

  const data = await res.json();
  const tokenData = tokenSchema.parse(data);
  return tokenData.access_token;
}
