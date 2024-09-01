import { artistsDataSchema } from "@/schemas/spotify";
import { Artist } from "@/types/spotify";
import { Dispatch, SetStateAction, useState } from "react";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface ArtistFinder {
  artistID: string | undefined;
  setArtistID: Dispatch<SetStateAction<string | undefined>>;
}

export default function ArtistFinder({ artistID, setArtistID }: ArtistFinder) {
  const [artistInput, setArtistInput] = useState<string>("");
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSearch(): Promise<void> {
    try {
      setLoading(true);
      setArtistID(undefined);
      const artists = await getArtists();
      setArtists(artists);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function getArtists(): Promise<Artist[]> {
    const res = await fetch(
      encodeURI(`/api/v1/spotify/artists/${artistInput}`),
      {
        method: "GET",
      },
    );
    const data: z.infer<typeof artistsDataSchema> = await res.json();
    return data.artists.items;
  }

  return (
    <>
      <Input
        value={artistInput}
        onChange={(e) => setArtistInput(e.currentTarget.value)}
      />
      <Button
        disabled={!artistInput}
        aria-disabled={!artistInput}
        onClick={handleSearch}
      >
        Search
      </Button>
      <Select
        value={artistID}
        disabled={!artists.length}
        onValueChange={(val) => setArtistID(val)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select an artist" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {artists.map((artist) => (
              <SelectItem key={artist.id} value={artist.id}>
                <div className="flex justify-start items-center gap-x-4 h-max">
                  <Avatar>
                    <AvatarImage
                      src={artist.images[0]?.url}
                      alt={artist.name}
                    />
                    <AvatarFallback>{artist.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col ">
                    <p className="text-base">{artist.name}</p>
                    <p className="text-xs text-zinc-500">
                      {`${artist.followers.total.toLocaleString()} followers`}
                    </p>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}
