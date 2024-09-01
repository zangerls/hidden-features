import { getAccessToken } from "@/lib/spotify";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { artistId: string } },
) {
  try {
    const accessToken = await getAccessToken();
    const url = `${process.env.SPOTIFY_BASE_URL}/artists/${params.artistId}/albums?include_groups=album,appears_on,single&limit=50`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) return res;

    const data = await res.json();
    return NextResponse.json(data);
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
