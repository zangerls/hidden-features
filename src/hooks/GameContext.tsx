"use client";

import { SimplifiedAlbum, SimplifiedArtist } from "@/types/spotify";
import { createContext, Dispatch, SetStateAction, useState } from "react";

type GameContext = {
  seenArtists: SimplifiedArtist[];
  setSeenArtists: Dispatch<SetStateAction<SimplifiedArtist[]>>;
  seenAlbums: SimplifiedAlbum[];
  setSeenAlbums: Dispatch<SetStateAction<SimplifiedAlbum[]>>;
};

export const GameContext = createContext<GameContext>({
  seenArtists: [],
  setSeenArtists: () => undefined,
  seenAlbums: [],
  setSeenAlbums: () => undefined,
});

type GameProvider = {
  children: React.ReactNode;
};

export default function GameProvider({ children }: GameProvider) {
  const [seenArtists, setSeenArtists] = useState<SimplifiedArtist[]>([]);
  const [seenAlbums, setSeenAlbums] = useState<SimplifiedAlbum[]>([]);

  return (
    <GameContext.Provider
      value={{
        seenArtists: seenArtists,
        setSeenArtists: setSeenArtists,
        seenAlbums: seenAlbums,
        setSeenAlbums: setSeenAlbums,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
