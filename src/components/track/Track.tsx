import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { artistsDataSchema } from "@/schemas/spotify";
import { Artist, Track as TrackType } from "@/types/spotify";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { AspectRatio } from "../ui/aspect-ratio";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

type TrackProps = TrackType & {
  currentArtistId: string;
  setCurrentArtistId: Dispatch<SetStateAction<string>>;
  closeSheet: () => void;
};

export default function Track({
  id,
  name,
  track_number,
  artists,
  duration_ms,
  explicit,
  currentArtistId,
  setCurrentArtistId,
  closeSheet,
}: TrackProps) {
  const [features, setFeatures] = useState<Artist[]>([]);
  const [opened, setOpened] = useState<boolean>(false);

  async function getSeveralArtistsById(artistIds: string[]) {
    try {
      const res = await fetch("/api/v1/spotify/artists/several", {
        method: "POST",
        body: JSON.stringify({
          artistIds: artists.map((artist) => artist.id),
        }),
      });

      const data = await res.json();
      const artistsData = artistsDataSchema.parse(data);
      setFeatures(artistsData.artists.items);
    } catch (e) {
      console.error(e);
    }
  }

  function handleOpen(): void {
    setOpened(true);
    getSeveralArtistsById(artists.map((artist) => artist.id));
  }

  function anonymizeFeatures(
    title: string,
    features: { id: string; name: string }[],
  ): string {
    for (const feature of features) {
      title = title.replaceAll(feature.name, "•");
    }
    return title;
  }

  function selectNewArtist(id: string): void {
    setCurrentArtistId(id);
    closeSheet();
  }

  function getFeatures(): string {
    const mainArtist =
      artists.find((artist) => artist.id === currentArtistId)?.name ||
      "Unknown lead artist";
    const features =
      artists.length > 1 ? `and ${artists.length - 1} other(s)` : "";
    return `${mainArtist} ${features}`;
  }

  function msToDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const min = Math.floor(seconds / 60).toString();
    const remainingSeconds = (seconds % 60).toString();
    return `${min.padStart(2, "0")}:${remainingSeconds.padStart(2, "0")}`;
  }

  function TrackItem() {
    return (
      <div className="group relative">
        <Button
          onClick={handleOpen}
          className="group-hover:opacity-100 opacity-0 transition-all duration-200 bg-zinc-100 text-black hover:bg-zinc-200 hover:text-black absolute z-50 right-[50%] bottom-[50%] translate-x-[50%] translate-y-[50%]"
        >{`Try ${anonymizeFeatures(name, artists)}`}</Button>
        <div className="group-hover:brightness-50 transition-all duration-200 bg-zinc-900 flex justify-between items-center p-4 rounded-md">
          <div className="flex items-center gap-4">
            <p className="text-zinc-400">{track_number}</p>
            <div className="flex flex-col justify-start">
              <div className="flex flex-col gap-1">
                <p className="text-start truncate text-white">
                  {anonymizeFeatures(name, artists)}
                </p>
                <div className="flex justify-start items-center gap-2">
                  {explicit && (
                    <Badge className="px-1.5 bg-zinc-200 text-zinc-900 hover:bg-zinc-300 hover:text-zinc-900">
                      E
                    </Badge>
                  )}
                  <p className="truncate text-sm text-zinc-400">
                    {getFeatures()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-zinc-400">{msToDuration(duration_ms)}</p>
        </div>
      </div>
    );
  }

  return (
    <Dialog open={opened}>
      <TrackItem />
      <DialogContent withCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Here are the features</DialogTitle>
          <DialogDescription>
            Pick a new artist or choose the one you are already on to try
            another one of their albums.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="flex flex-col justify-start items-start gap-1 cursor-pointer"
              onClick={() => selectNewArtist(feature.id)}
            >
              <AspectRatio ratio={1 / 1}>
                <Image
                  className="rounded-md"
                  src={feature.images[0]?.url}
                  alt={feature.name}
                  fill
                />
              </AspectRatio>
              <p className="text-sm">{feature.name}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
