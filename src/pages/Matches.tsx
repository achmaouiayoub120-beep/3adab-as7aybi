import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, Search, Filter, SlidersHorizontal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import MatchCard from "@/components/match/MatchCard";
import { Loader2 } from "lucide-react";
import { staggerContainer, staggerItem } from "@/design-system/animations";

export default function Matches() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [selectedStadium, setSelectedStadium] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState(500);
  const [showFilters, setShowFilters] = useState(false);

  const { data: matchesData, isLoading } = useQuery({
    queryKey: ["matches"],
    queryFn: async () => {
      const res = await api.get("/matches");
      return res.data.data;
    },
  });

  const matches: any[] = matchesData || [];

  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      const home = match.homeTeam;
      const away = match.awayTeam;
      const stadium = match.stadium;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          home?.name.toLowerCase().includes(q) ||
          away?.name.toLowerCase().includes(q) ||
          stadium?.name.toLowerCase().includes(q) ||
          stadium?.city.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }

      if (selectedTeam && match.homeTeamId !== selectedTeam && match.awayTeamId !== selectedTeam) return false;
      if (selectedStadium && match.stadiumId !== selectedStadium) return false;
      if (match.pricePopulaire > maxPrice) return false;

      return true;
    });
  }, [matches, searchQuery, selectedTeam, selectedStadium, maxPrice]);

  // Group matches by date
  const grouped = filteredMatches.reduce<Record<string, any[]>>((acc, match) => {
    const dateKey = new Date(match.date).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(match);
    return acc;
  }, {});

  // Extract unique teams and stadiums from all matches for filters
  const teams = useMemo(() => {
    const map = new Map();
    matches.forEach(m => {
        if (m.homeTeam) map.set(m.homeTeam.id, m.homeTeam);
        if (m.awayTeam) map.set(m.awayTeam.id, m.awayTeam);
    });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [matches]);

  const stadiums = useMemo(() => {
    const map = new Map();
    matches.forEach(m => {
        if (m.stadium) map.set(m.stadium.id, m.stadium);
    });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [matches]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTeam(null);
    setSelectedStadium(null);
    setMaxPrice(500);
  };

  const hasActiveFilters = searchQuery || selectedTeam || selectedStadium || maxPrice < 500;

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="section-tag">
            <Calendar className="w-3 h-3" />
            Calendrier
          </span>
          <h1 className="text-display text-5xl md:text-6xl text-foreground">
            TOUS LES MATCHS
          </h1>
          <p className="text-muted-foreground mt-3 font-heading">
            Journée 26 · Botola Pro Inwi 2025–2026
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
          {/* ═══ FILTERS SIDEBAR ═══ */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-72 shrink-0"
          >
            {/* Mobile toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden w-full btn-outline-neon text-xs py-2 mb-4 flex items-center justify-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {showFilters ? "Masquer filtres" : "Afficher filtres"}
            </button>

            <div className={`${showFilters ? "block" : "hidden"} lg:block lg:sticky lg:top-24 space-y-4`}>
              {/* Search */}
              <div className="glass p-4">
                <label className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-2 block">
                  <Search className="inline w-3 h-3 mr-1" />
                  Recherche
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Équipe, stade, ville..."
                  className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              {/* Team filter */}
              <div className="glass p-4">
                <label className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-2 block">
                  <Filter className="inline w-3 h-3 mr-1" />
                  Équipe
                </label>
                <select
                  value={selectedTeam ?? ""}
                  onChange={(e) => setSelectedTeam(e.target.value ? Number(e.target.value) : null)}
                  className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Toutes les équipes</option>
                  {teams.map((team: any) => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </div>

              {/* Stadium filter */}
              <div className="glass p-4">
                <label className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-2 block">
                  Stade
                </label>
                <select
                  value={selectedStadium ?? ""}
                  onChange={(e) => setSelectedStadium(e.target.value ? Number(e.target.value) : null)}
                  className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Tous les stades</option>
                  {stadiums.map((stadium: any) => (
                    <option key={stadium.id} value={stadium.id}>{stadium.name}</option>
                  ))}
                </select>
              </div>

              {/* Price range */}
              <div className="glass p-4">
                <label className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-2 block">
                  Prix max: <span className="font-mono text-primary">{maxPrice} MAD</span>
                </label>
                <input
                  type="range"
                  min={20}
                  max={500}
                  step={10}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>20 MAD</span>
                  <span>500 MAD</span>
                </div>
              </div>

              {/* Clear filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full text-xs text-accent font-heading font-bold uppercase tracking-wider py-2 hover:underline"
                >
                  ✕ Effacer les filtres
                </button>
              )}

              {/* Results count */}
              <div className="text-center">
                <span className="font-mono text-sm text-muted-foreground">
                  {filteredMatches.length} match{filteredMatches.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </motion.aside>

          {/* ═══ MATCHES LIST ═══ */}
          <div className="flex-1 space-y-12">
            {Object.keys(grouped).length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground font-heading">Aucun match trouvé</p>
                <p className="text-xs text-muted-foreground mt-1">Essayez de modifier vos filtres</p>
              </motion.div>
            ) : (
              Object.entries(grouped).map(([dateLabel, matches]) => (
                <div key={dateLabel}>
                  <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="font-heading font-semibold text-foreground text-lg mb-4 capitalize flex items-center gap-3"
                  >
                    <div className="w-1.5 h-6 rounded-full bg-primary" />
                    {dateLabel}
                  </motion.h3>
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {matches.map((match) => (
                      <motion.div key={match.id} variants={staggerItem}>
                        <MatchCard match={match} />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
