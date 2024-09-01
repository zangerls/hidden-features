import { getAccessToken } from "@/lib/spotify";
import { artistsDataSchema } from "@/schemas/spotify";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const searchParamsSchema = z.object({
  slug: z.string(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  try {
    cookies();
    const searchParams = searchParamsSchema.safeParse(params);

    if (!searchParams.success) {
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "No artist(s) provided",
        },
        { status: 400, statusText: "Bad Request" },
      );
    }

    const accessToken = await getAccessToken();
    const url = encodeURI(
      `${process.env.SPOTIFY_BASE_URL}/search?q=${searchParams.data.slug}&type=artist&limit=20&offset=0`,
    );
    console.log(url);
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      return res;
    }

    console.log("HERE");
    const data = await res.json();
    console.log(data);
    const artists = artistsDataSchema.parse(data);

    return NextResponse.json(artists);
  } catch (e) {
    console.error(e);
    return NextResponse.json({}, { status: 500 });
  }
}
