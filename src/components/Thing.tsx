"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GameContext } from "@/hooks/GameContext";
import { albumsDataSchema } from "@/schemas/spotify";
import { Album as AlbumType, Artist } from "@/types/spotify";
import { useContext, useEffect, useState } from "react";
import Album from "./album/Album";
import { Input } from "./ui/input";

type Thing = {
  initialArtist: Artist;
  goalArtist: Artist;
};

export default function Thing({ initialArtist, goalArtist }: Thing) {
  const { seenAlbums, seenArtists, difficulty, setDifficulty } =
    useContext(GameContext);

  const [currentArtistId, setCurrentArtistId] = useState<string>(
    initialArtist.id,
  );
  const [albums, setAlbums] = useState<AlbumType[]>([]);
  const [won, setWon] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    setWon(currentArtistId === goalArtist.id);
  }, [goalArtist, currentArtistId]);

  /**
   * Reduces the full body of work (single, album, appears on) to just a subset
   */
  function adjustDifficulty(album: AlbumType): album is AlbumType {
    switch (difficulty) {
      case "easy":
        return true;
      case "moderate":
        return album.album_group === "album" || album.album_group === "single";
      case "hard":
        return album.album_group === "album";
      default:
        return false;
    }
  }

  function searchForWork(album: AlbumType): album is AlbumType {
    if (!search) return true;
    return album.name.includes(search);
  }

  useEffect(() => {
    if (!currentArtistId) return;
    async function getAlbumsByArtist(artistId: string): Promise<void> {
      try {
        const res = await fetch(`/api/v1/spotify/albums/${artistId}`, {
          method: "GET",
        });
        const data = await res.json();
        const albumData = albumsDataSchema.parse(data);
        setAlbums(albumData.items);
      } catch (e) {
        console.error(e);
      }
    }
    getAlbumsByArtist(currentArtistId);
  }, [currentArtistId]);

  return (
    <>
      {!won ? (
        <>
          <Tabs
            value={difficulty}
            onValueChange={(e) => setDifficulty(e)}
            defaultValue="easy"
          >
            <TabsList>
              <TabsTrigger value="easy">Easy</TabsTrigger>
              <TabsTrigger value="moderate">Moderate</TabsTrigger>
              <TabsTrigger value="hard">Hard</TabsTrigger>
            </TabsList>
            <TabsContent value="easy">
              Albums, singles and work they appear on
            </TabsContent>
            <TabsContent value="moderate">
              {`The artist's albums and singles`}
            </TabsContent>
            <TabsContent value="hard">Only albums</TabsContent>
          </Tabs>
          <Input
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-6 gap-4">
            {albums
              .filter(adjustDifficulty)
              .filter(searchForWork)
              .map((album) => (
                <Album
                  key={album.id}
                  {...album}
                  currentArtistId={currentArtistId}
                  setCurrentArtistId={setCurrentArtistId}
                />
              ))}
          </div>
        </>
      ) : (
        <>
          <div>you won</div>
          <div>{seenAlbums.map((album) => album.name).join(", ")}</div>
          <div>{seenArtists.map((artist) => artist.name).join(", ")}</div>
        </>
      )}
    </>
  );
}
