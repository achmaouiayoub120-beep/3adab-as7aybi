import { useState } from "react";
import type { Team } from "@/data/teams";

interface TeamLogoProps {
  team: Team;
  size?: number;
  className?: string;
}

export default function TeamLogo({ team, size = 40, className = "" }: TeamLogoProps) {
  const [imgError, setImgError] = useState(false);

  const imgSrc = (team as any).logoUrl || team.logo;

  // If there's a logo and we haven't encountered an error, try rendering it
  if (imgSrc && !imgError) {
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

  const bgColor = (team as any).color1 || (team.colors && team.colors[0]) || "#ccc";
  const textColor = (team as any).color2 || (team.colors && team.colors[1]) || "#fff";

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        background: bgColor,
        color: textColor,
      }}
    >
      {team.shortName?.slice(0, 3)}
    </div>
  );
}
