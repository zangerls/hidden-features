"use client";

import { GameDifficulty } from "@/types/main";
import { SimplifiedAlbum, SimplifiedArtist } from "@/types/spotify";
import { createContext, Dispatch, SetStateAction, useState } from "react";

type GameContext = {
  seenArtists: SimplifiedArtist[];
  setSeenArtists: Dispatch<SetStateAction<SimplifiedArtist[]>>;
  seenAlbums: SimplifiedAlbum[];
  setSeenAlbums: Dispatch<SetStateAction<SimplifiedAlbum[]>>;
  difficulty: GameDifficulty;
  setDifficulty: Dispatch<SetStateAction<GameDifficulty>>;
};

export const GameContext = createContext<GameContext>({
  seenArtists: [],
  setSeenArtists: () => undefined,
  seenAlbums: [],
  setSeenAlbums: () => undefined,
  difficulty: "easy",
  setDifficulty: () => undefined,
});

type GameProvider = {
  children: React.ReactNode;
};

export default function GameProvider({ children }: GameProvider) {
  const [seenArtists, setSeenArtists] = useState<SimplifiedArtist[]>([]);
  const [seenAlbums, setSeenAlbums] = useState<SimplifiedAlbum[]>([]);
  const [difficulty, setDifficulty] = useState<GameDifficulty>("easy");

  return (
    <GameContext.Provider
      value={{
        seenArtists: seenArtists,
        setSeenArtists: setSeenArtists,
        seenAlbums: seenAlbums,
        setSeenAlbums: setSeenAlbums,
        difficulty: difficulty,
        setDifficulty: setDifficulty,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
