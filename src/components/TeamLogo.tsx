import { useState } from "react";
import type { Team } from "@/data/teams";

interface TeamLogoProps {
  team: Team;
  size?: number;
  className?: string;
}

export default function TeamLogo({ team, size = 40, className = "" }: TeamLogoProps) {
  const [imgError, setImgError] = useState(false);

  // If there's a logo and we haven't encountered an error, try rendering it
  if (team.logo && !imgError && (team as any).logoUrl !== null) {
    // Note: team object might use 'logo' (frontend) or 'logoUrl' (backend API). 
    // We try to support both.
    const imgSrc = (team as any).logoUrl || team.logo;
    
    if (imgSrc) {
      return (
        <img
          src={imgSrc}
          alt={team.name}
          onError={() => setImgError(true)}
          className={`object-contain ${className}`}
          style={{ width: size, height: size }}
        />
      );
    }
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        background: team.colors[0],
        color: team.colors[1],
      }}
    >
      {team.shortName.slice(0, 3)}
    </div>
  );
}
