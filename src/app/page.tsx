"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { artistSchema, artistsDataSchema } from "@/schemas/spotify";
import { Artist } from "@/types/spotify";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { ChangeEvent, useState } from "react";
import { z } from "zod";

export default function Home() {
  const [artistInput, setArtistInput] = useState<string>("");
  const [artists, setArtists] = useState<Artist[]>([]);
  const [selectedArtistID, setSelectedArtistID] = useState<string | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState<boolean>(false);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    setArtistInput(event.currentTarget.value);
  }

  async function handleSearch(): Promise<void> {
    try {
      setLoading(true);
      setSelectedArtistID(undefined);
      const artists = await getArtists();
      setArtists(artists);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function getArtists(): Promise<Artist[]> {
    const res = await fetch(`/api/v1/spotify/artists/${artistInput}`, {
      method: "GET",
    });
    const data: z.infer<typeof artistsDataSchema> = await res.json();
    return data.artists.items;
  }

  return (
    <>
      <Input value={artistInput} onChange={handleInputChange} />
      <Button onClick={handleSearch}>Search</Button>
      <Select value={selectedArtistID} disabled={!artists.length} defaultOpen>
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
