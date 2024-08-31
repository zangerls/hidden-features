import { NextResponse } from "next/server";
import { z } from "zod";

const tokenSchema = z.object({
  access_token: z.string(),
  token_type: z.literal("Bearer"),
  expires_in: z.number(),
});

export async function POST() {
  try {
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

    // TODO: Handle appropriately
    if (!res.ok) {
      return res;
    }

    const data = await res.json();
    const tokenData = tokenSchema.parse(data);

    // Equivalent to just returning `res`.. Not sure what I want to return from this route handler yet, though.
    return NextResponse.json(tokenData, { status: 200 });
  } catch (e) {
    // TODO: Handle appropriately
    return NextResponse.json({}, { status: 500 });
  }
}
