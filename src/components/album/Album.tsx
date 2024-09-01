import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { GameContext } from "@/hooks/GameContext";
import { tracksDataSchema } from "@/schemas/spotify";
import { Album as AlbumType, Track as TrackType } from "@/types/spotify";
import Image from "next/image";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import Track from "../track/Track";
import { AspectRatio } from "../ui/aspect-ratio";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

type AlbumProps = AlbumType & {
  currentArtistId: string;
  setCurrentArtistId: Dispatch<SetStateAction<string>>;
};

export default function Album({
  id,
  name,
  images,
  release_date,
  total_tracks,
  album_group,
  currentArtistId,
  setCurrentArtistId,
}: AlbumProps) {
  const { seenAlbums, setSeenAlbums } = useContext(GameContext);
  const [tracks, setTracks] = useState<TrackType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [opened, setOpened] = useState<boolean>(false);

  async function getTracks() {
    try {
      setLoading(true);
      const res = await fetch(`/api/v1/spotify/tracks/${id}`, {
        method: "GET",
      });

      const data = await res.json();
      const tracksData = tracksDataSchema.parse(data);
      setTracks(
        tracksData.items.sort((a, b) => a.track_number - b.track_number),
      );
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function tryAlbum() {
    setOpened(true);
    getTracks();
    setSeenAlbums((albums) => [...albums, { id: id, name: name }]);
  }

  function handleClose(): void {
    setOpened(false);
  }

  return (
    <>
      <Sheet open={opened}>
        <div className="group relative">
          <div className="group-hover:opacity-100 opacity-0 transition-all duration-200 p-4 w-[100%] h-[100%] text-center text-white flex flex-col justify-center items-center absolute z-50 right-[50%] bottom-[50%] translate-x-[50%] translate-y-[50%]">
            <p className="font-semibold">{name}</p>
            <div className="flex justify-center gap-2 text-sm mt-1">
              <p>{`Release: ${release_date.slice(0, 4)}`}</p>
              <Separator className="bg-white" orientation="vertical" />
              <p>{`Tracks: ${total_tracks}`}</p>
              {seenAlbums.map((seen) => seen.id).includes(id) && (
                <>
                  <Separator className="bg-white" orientation="vertical" />
                  <Badge className="bg-zinc-200 text-black hover:bg-zinc-200 hover:text-black">
                    Tried
                  </Badge>
                </>
              )}
            </div>
            <SheetTrigger>
              <Button
                onClick={tryAlbum}
                className="bg-zinc-100 text-black hover:bg-zinc-200 hover:text-black mt-4"
              >
                {`Use this ${album_group}`}
              </Button>
            </SheetTrigger>
          </div>
          <AspectRatio ratio={1 / 1}>
            <Image
              src={images[0]?.url}
              alt={`Album cover (${name})`}
              fill
              className="group-hover:brightness-50 transition-all duration-200"
            />
          </AspectRatio>
        </div>
        <SheetContent withCloseButton={false} className="min-w-[32rem]">
          <SheetHeader>
            <SheetTitle>{name}</SheetTitle>
            <SheetDescription>
              {`Released: ${release_date.slice(0, 4)} - Total tracks: ${total_tracks}`}
            </SheetDescription>
            <ScrollArea className="h-[80vh]">
              <div className="flex flex-col justify-start align-start gap-4">
                {tracks.map((track) => (
                  <Track
                    key={track.id}
                    {...track}
                    currentArtistId={currentArtistId}
                    setCurrentArtistId={setCurrentArtistId}
                    closeSheet={handleClose}
                  />
                ))}
              </div>
            </ScrollArea>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
}
