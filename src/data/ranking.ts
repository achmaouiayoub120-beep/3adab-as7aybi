export interface RankingEntry {
  rank: number;
  teamId: number;
  club: string;
  shortName: string;
  mj: number;
  g: number;
  n: number;
  p: number;
  bp: number;
  bc: number;
  diff: number;
  pts: number;
  form: ("W" | "D" | "L")[];
}

export const RANKING: RankingEntry[] = [
  { rank: 1, teamId: 2, club: "Raja Club Athletic", shortName: "RCA", mj: 15, g: 8, n: 6, p: 1, bp: 17, bc: 4, diff: 13, pts: 30, form: ["W", "W", "D", "W", "D"] },
  { rank: 2, teamId: 1, club: "Wydad Athletic Club", shortName: "WAC", mj: 12, g: 9, n: 2, p: 1, bp: 25, bc: 10, diff: 15, pts: 29, form: ["W", "W", "W", "L", "W"] },
  { rank: 3, teamId: 5, club: "Maghreb de Fès", shortName: "MAS", mj: 13, g: 7, n: 6, p: 0, bp: 20, bc: 6, diff: 14, pts: 27, form: ["D", "W", "W", "D", "W"] },
  { rank: 4, teamId: 3, club: "AS FAR", shortName: "FAR", mj: 12, g: 7, n: 5, p: 0, bp: 20, bc: 3, diff: 17, pts: 26, form: ["W", "D", "W", "W", "D"] },
  { rank: 5, teamId: 11, club: "COD Meknès", shortName: "CODM", mj: 15, g: 7, n: 5, p: 3, bp: 21, bc: 11, diff: 10, pts: 26, form: ["W", "L", "W", "W", "D"] },
  { rank: 6, teamId: 6, club: "RS Berkane", shortName: "RSB", mj: 12, g: 7, n: 3, p: 2, bp: 21, bc: 12, diff: 9, pts: 24, form: ["W", "W", "L", "W", "D"] },
  { rank: 7, teamId: 7, club: "Hassania Agadir", shortName: "HUSA", mj: 13, g: 6, n: 4, p: 3, bp: 18, bc: 14, diff: 4, pts: 22, form: ["D", "W", "D", "L", "W"] },
  { rank: 8, teamId: 8, club: "Ittihad de Tanger", shortName: "IRT", mj: 13, g: 5, n: 4, p: 4, bp: 15, bc: 16, diff: -1, pts: 19, form: ["L", "D", "W", "D", "W"] },
  { rank: 9, teamId: 4, club: "FUS Rabat", shortName: "FUS", mj: 13, g: 5, n: 3, p: 5, bp: 14, bc: 15, diff: -1, pts: 18, form: ["W", "L", "D", "L", "W"] },
  { rank: 10, teamId: 9, club: "Olympique Safi", shortName: "OCS", mj: 13, g: 4, n: 5, p: 4, bp: 13, bc: 16, diff: -3, pts: 17, form: ["D", "L", "W", "D", "D"] },
  { rank: 11, teamId: 10, club: "Difaâ El Jadida", shortName: "DHJ", mj: 12, g: 4, n: 4, p: 4, bp: 11, bc: 14, diff: -3, pts: 16, form: ["L", "D", "W", "L", "D"] },
  { rank: 12, teamId: 15, club: "Kawkab Marrakech", shortName: "KACM", mj: 13, g: 4, n: 3, p: 6, bp: 12, bc: 18, diff: -6, pts: 15, form: ["L", "W", "L", "D", "L"] },
  { rank: 13, teamId: 12, club: "Union Touarga", shortName: "UTS", mj: 12, g: 3, n: 4, p: 5, bp: 10, bc: 18, diff: -8, pts: 13, form: ["L", "D", "L", "W", "L"] },
  { rank: 14, teamId: 16, club: "Union Yacoub El Mansour", shortName: "UYM", mj: 12, g: 3, n: 3, p: 6, bp: 9, bc: 20, diff: -11, pts: 12, form: ["L", "L", "D", "L", "W"] },
  { rank: 15, teamId: 13, club: "Renaissance Zemamra", shortName: "RSZ", mj: 13, g: 2, n: 3, p: 8, bp: 8, bc: 22, diff: -14, pts: 9, form: ["L", "L", "L", "D", "L"] },
  { rank: 16, teamId: 14, club: "Olympique Dcheira", shortName: "ODJ", mj: 12, g: 1, n: 4, p: 7, bp: 7, bc: 25, diff: -18, pts: 7, form: ["L", "D", "L", "L", "D"] },
];
