"use client";

import ArtistFinder from "@/components/artistFinder/ArtistFinder";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [initialArtistID, setInitialArtistID] = useState<string | undefined>(
    undefined,
  );
  const [finalArtistID, setFinalArtistID] = useState<string | undefined>(
    undefined,
  );
  const router = useRouter();

  function navigateToGame(): void {
    router.push(`${initialArtistID}/${finalArtistID}`);
  }

  return (
    <div>
      <ArtistFinder
        artistID={initialArtistID}
        setArtistID={setInitialArtistID}
        input={{
          label: "Artist (Starting point)",
          placeholder: "Search for an artist",
        }}
        select={{
          label: "Artist (Starting point)",
          placeholder: "Select an artist",
        }}
      />
      <ArtistFinder
        artistID={finalArtistID}
        setArtistID={setFinalArtistID}
        input={{
          label: "Artist (Goal)",
          placeholder: "Search for an artist",
        }}
        select={{
          label: "Artist (Goal)",
          placeholder: "Select an artist",
        }}
      />
      <Button
        disabled={!(initialArtistID && finalArtistID)}
        aria-disabled={!(initialArtistID && finalArtistID)}
        onClick={navigateToGame}
      >
        Start the game
      </Button>
    </div>
  );
}
