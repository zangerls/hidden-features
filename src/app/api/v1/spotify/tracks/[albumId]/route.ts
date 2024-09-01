import { getAccessToken } from "@/lib/spotify";
import { tracksDataSchema } from "@/schemas/spotify";
import { NextResponse } from "next/server";

export async function GET({ params }: { params: { albumId: string } }) {
  try {
    const accessToken = await getAccessToken();
    const url = `${process.env.SPOTIFY_BASE_URL}/albums/${params.albumId}/tracks?limit=50`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) return res;

    const data = await res.json();
    const tracksData = tracksDataSchema.parse(data);
    return NextResponse.json(tracksData);
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
