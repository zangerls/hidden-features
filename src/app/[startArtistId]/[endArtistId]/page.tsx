import Thing from "@/components/Thing";
import { getAccessToken } from "@/lib/spotify";
import { artistSchema } from "@/schemas/spotify";
import { Artist } from "@/types/spotify";
import { Metadata, ResolvingMetadata } from "next";
import { notFound, redirect } from "next/navigation";

type Props = {
  params: { startArtistId: string; endArtistId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const startArtist = await getArtistById(params.startArtistId);
  const endArtist = await getArtistById(params.endArtistId);

  if (!startArtist || !endArtist) return {};

  return {
    title: `${startArtist.name} to ${endArtist.name}`,
  };
}

async function getArtistById(id: string): Promise<Artist | undefined> {
  try {
    const accessToken = await getAccessToken();
    const res = await fetch(`${process.env.SPOTIFY_BASE_URL}/artists/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      console.log(res);
      return;
    }

    const data = await res.json();
    const artist = artistSchema.parse(data);
    return artist;
  } catch (e) {
    console.error(e);
  }
}

export default async function Game({ params }: Props) {
  if (params.startArtistId === params.endArtistId) redirect("/");

  const startArtist = await getArtistById(params.startArtistId);
  const endArtist = await getArtistById(params.endArtistId);

  if (!(startArtist && endArtist)) notFound();

  return (
    <>
      <p>{startArtist.name}</p>
      <p>{endArtist.name}</p>
      <Thing initialArtist={startArtist} goalArtist={endArtist} />
    </>
  );
}
