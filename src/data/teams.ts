export interface Team {
  id: number;
  name: string;
  shortName: string;
  city: string;
  colors: [string, string];
  stadiumId: number;
  logo?: string;
}

export const TEAMS: Team[] = [
  { id: 1, name: "Wydad Athletic Club", shortName: "WAC", city: "Casablanca", colors: ["#DC143C", "#FFFFFF"], stadiumId: 1 },
  { id: 2, name: "Raja Club Athletic", shortName: "RCA", city: "Casablanca", colors: ["#00A651", "#FFFFFF"], stadiumId: 1, logo: "/teams/rca.png" },
  { id: 3, name: "AS FAR", shortName: "FAR", city: "Rabat", colors: ["#DC143C", "#FFFFFF"], stadiumId: 2, logo: "/teams/far.png" },
  { id: 4, name: "FUS Rabat", shortName: "FUS", city: "Rabat", colors: ["#DC143C", "#FFFFFF"], stadiumId: 2, logo: "/teams/fus.png" },
  { id: 5, name: "Maghreb de Fes", shortName: "MAS", city: "Fes", colors: ["#FFD700", "#000000"], stadiumId: 4, logo: "/teams/mas.png" },
  { id: 6, name: "RS Berkane", shortName: "RSB", city: "Berkane", colors: ["#FF6B00", "#000000"], stadiumId: 5, logo: "/teams/rsb.png" },
  { id: 7, name: "Hassania Agadir", shortName: "HUSA", city: "Agadir", colors: ["#003F8A", "#FFFFFF"], stadiumId: 6, logo: "/teams/husa.png" },
  { id: 8, name: "Ittihad de Tanger", shortName: "IRT", city: "Tanger", colors: ["#1A3C8F", "#FFFFFF"], stadiumId: 7, logo: "/teams/irt.png" },
  { id: 9, name: "Olympique Club de Safi", shortName: "OCS", city: "Safi", colors: ["#1B2A4A", "#DC143C"], stadiumId: 8, logo: "/teams/ocs.png" },
  { id: 10, name: "Difaa Hassani El Jadida", shortName: "DHJ", city: "El Jadida", colors: ["#00A651", "#FFFFFF"], stadiumId: 9, logo: "/teams/dhj.png" },
  { id: 11, name: "COD Meknes", shortName: "CODM", city: "Meknes", colors: ["#DC143C", "#FFFFFF"], stadiumId: 10, logo: "/teams/codm.png" },
  { id: 12, name: "Union Touarga Sportif", shortName: "UTS", city: "Rabat", colors: ["#D4A017", "#FFFFFF"], stadiumId: 2, logo: "/teams/uts.png" },
  { id: 13, name: "Renaissance Zemamra", shortName: "RSZ", city: "Zemamra", colors: ["#2E7BD6", "#FFFFFF"], stadiumId: 10, logo: "/teams/rsz.png" },
  { id: 14, name: "Olympique Dcheira", shortName: "ODJ", city: "Dcheira", colors: ["#00A651", "#FFFFFF"], stadiumId: 6, logo: "/teams/odj.png" },
  { id: 15, name: "Kawkab Marrakech", shortName: "KACM", city: "Marrakech", colors: ["#8B1A1A", "#FFD700"], stadiumId: 3, logo: "/teams/kacm.png" },
  { id: 16, name: "Union Yacoub El Mansour", shortName: "UYM", city: "Rabat", colors: ["#00A651", "#FFFFFF"], stadiumId: 2 },
];

export const getTeamById = (id: number) => TEAMS.find(t => t.id === id);
