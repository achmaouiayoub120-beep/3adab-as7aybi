import { motion } from "framer-motion";
import { MapPin, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import type { Team } from "@/data/teams";
import { RANKING } from "@/data/ranking";
import { getStadiumById } from "@/data/stadiums";
import TeamLogo from "@/components/TeamLogo";

export default function TeamFlipCard({ team }: { team: Team }) {
    const ranking = RANKING.find(r => r.teamId === team.id);
    const stadium = getStadiumById(team.stadiumId);

    return (
        <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flip-card h-56 cursor-pointer"
        >
            <div className="flip-card-inner">
                {/* FRONT */}
                <div className="flip-card-front glass p-6 flex flex-col items-center justify-center gap-3">
                    <TeamLogo team={team} size={56} />
                    <h3 className="font-heading font-bold text-foreground text-sm text-center leading-tight">
                        {team.name}
                    </h3>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {team.city}
                    </span>
                </div>

                {/* BACK */}
                <div className="flip-card-back glass p-5 flex flex-col items-center justify-center gap-2"
                    style={{ background: `linear-gradient(135deg, ${team.colors[0]}15, transparent)` }}
                >
                    {ranking && (
                        <>
                            <div className="flex items-center gap-1.5 mb-1">
                                {ranking.rank <= 2 && <Trophy className="w-4 h-4 text-gold" />}
                                <span className="font-mono text-2xl font-bold text-foreground">#{ranking.rank}</span>
                            </div>
                            <span className="font-mono text-lg text-primary font-bold">{ranking.pts} pts</span>
                            <span className="text-xs text-muted-foreground">{ranking.mj} matchs joués</span>
                        </>
                    )}
                    {stadium && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {stadium.name}
                        </span>
                    )}
                    <Link
                        to="/matches"
                        className="mt-2 text-xs font-heading font-bold text-primary uppercase tracking-wider hover:underline"
                    >
                        Voir matchs →
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
