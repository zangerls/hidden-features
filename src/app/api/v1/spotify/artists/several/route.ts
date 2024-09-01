import { getAccessToken } from "@/lib/spotify";
import { artistSchema, artistsDataSchema } from "@/schemas/spotify";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const requestBodySchema = z.object({
  artistIds: z.array(z.string()),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const requestBody = requestBodySchema.parse(body);

    const accessToken = await getAccessToken();
    const res = await fetch(
      `${process.env.SPOTIFY_BASE_URL}/artists?ids=${requestBody.artistIds.join(",")}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    if (!res.ok) return res;

    const data = await res.json();
    const artistsListSchema = z.object({
      artists: z.array(artistSchema),
    });
    const artistsData = artistsListSchema.parse(data);

    // convert to artistsDataSchema
    const uniformDataShape: z.infer<typeof artistsDataSchema> = {
      artists: {
        items: artistsData.artists,
        total: artistsData.artists.length,
      },
    };

    return NextResponse.json(uniformDataShape);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500, statusText: "Internal Server Error" },
    );
  }
}
