export interface Match {
  id: number;
  homeTeamId: number;
  awayTeamId: number;
  stadiumId: number;
  date: string;
  matchday: number;
  priceVip: number;
  priceTribune: number;
  pricePopulaire: number;
  seatsTotal: number;
  seatsAvailable: number;
  status: "SCHEDULED" | "LIVE" | "FINISHED" | "CANCELLED";
}

export const MATCHES: Match[] = [
  { id: 1, homeTeamId: 11, awayTeamId: 8, stadiumId: 10, date: "2026-03-06T22:00:00", matchday: 26, priceVip: 200, priceTribune: 100, pricePopulaire: 50, seatsTotal: 8000, seatsAvailable: 5200, status: "SCHEDULED" },
  { id: 2, homeTeamId: 16, awayTeamId: 4, stadiumId: 2, date: "2026-03-06T22:00:00", matchday: 26, priceVip: 150, priceTribune: 80, pricePopulaire: 40, seatsTotal: 52000, seatsAvailable: 31000, status: "SCHEDULED" },
  { id: 3, homeTeamId: 15, awayTeamId: 7, stadiumId: 3, date: "2026-03-07T22:00:00", matchday: 26, priceVip: 180, priceTribune: 90, pricePopulaire: 50, seatsTotal: 15000, seatsAvailable: 9800, status: "SCHEDULED" },
  { id: 4, homeTeamId: 2, awayTeamId: 9, stadiumId: 1, date: "2026-03-07T22:00:00", matchday: 26, priceVip: 400, priceTribune: 200, pricePopulaire: 100, seatsTotal: 67000, seatsAvailable: 2100, status: "SCHEDULED" },
  { id: 5, homeTeamId: 13, awayTeamId: 3, stadiumId: 10, date: "2026-03-07T22:00:00", matchday: 26, priceVip: 150, priceTribune: 80, pricePopulaire: 40, seatsTotal: 8000, seatsAvailable: 6700, status: "SCHEDULED" },
  { id: 6, homeTeamId: 12, awayTeamId: 1, stadiumId: 2, date: "2026-03-08T22:00:00", matchday: 26, priceVip: 350, priceTribune: 180, pricePopulaire: 90, seatsTotal: 52000, seatsAvailable: 1500, status: "SCHEDULED" },
  { id: 7, homeTeamId: 6, awayTeamId: 10, stadiumId: 5, date: "2026-03-08T22:00:00", matchday: 26, priceVip: 160, priceTribune: 80, pricePopulaire: 40, seatsTotal: 12000, seatsAvailable: 8400, status: "SCHEDULED" },
  { id: 8, homeTeamId: 14, awayTeamId: 5, stadiumId: 6, date: "2026-03-08T22:00:00", matchday: 26, priceVip: 150, priceTribune: 70, pricePopulaire: 35, seatsTotal: 45480, seatsAvailable: 38000, status: "SCHEDULED" },
];
