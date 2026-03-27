import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Calendar, Clock, Users } from "lucide-react";
import { useCountdown } from "@/hooks/useCountdown";
import TeamLogo from "@/components/TeamLogo";

function CountdownDisplay({ date }: { date: string }) {
  const { days, hours, minutes, seconds } = useCountdown(date);
  return (
    <div className="flex gap-2 font-mono text-xs text-primary">
      <span>{days}j</span>
      <span>{hours}h</span>
      <span>{minutes}m</span>
      <span>{seconds}s</span>
    </div>
  );
}

export default function MatchCard({ match }: { match: any }) {
  const home = match.homeTeam;
  const away = match.awayTeam;
  const stadium = match.stadium;
  const dateObj = new Date(match.date);
  const fillPercent = ((match.seatsTotal - match.seatsAvailable) / match.seatsTotal) * 100;
  const isAlmostFull = fillPercent > 90;
  const isFull = match.seatsAvailable === 0;

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="glass overflow-hidden group cursor-pointer"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse-slow" />
          <span className="text-xs text-muted-foreground uppercase font-medium">
            <Calendar className="inline w-3 h-3 mr-1" />
            {dateObj.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
          </span>
          <span className="text-xs text-muted-foreground">
            <Clock className="inline w-3 h-3 mr-1" />
            {dateObj.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
        <span className="text-xs font-mono text-muted-foreground">J{match.matchday}</span>
      </div>

      {/* Teams */}
      <div className="px-5 py-6 flex items-center justify-between">
        <div className="flex flex-col items-center gap-2 flex-1">
          <TeamLogo team={home} size={48} />
          <span className="text-xs font-heading font-semibold text-foreground text-center leading-tight">{home?.name}</span>
        </div>
        <div className="flex flex-col items-center gap-1 px-4">
          <span className="font-display text-2xl text-muted-foreground">VS</span>
          <CountdownDisplay date={match.date} />
        </div>
        <div className="flex flex-col items-center gap-2 flex-1">
          <TeamLogo team={away} size={48} />
          <span className="text-xs font-heading font-semibold text-foreground text-center leading-tight">{away?.name}</span>
        </div>
      </div>

      {/* Info */}
      <div className="px-5 pb-3 space-y-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>{stadium?.name}, {stadium?.city}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="w-3 h-3" />
          <div className="flex-1">
            <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: fillPercent / 100 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className={`h-full rounded-full origin-left ${isAlmostFull ? "bg-accent" : "bg-primary"}`}
              />
            </div>
          </div>
          <span className="font-mono text-xs">
            {match.seatsAvailable.toLocaleString()} / {match.seatsTotal.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-border flex items-center justify-between">
        <span className="text-sm font-heading text-foreground">
          À partir de <span className="text-primary font-bold font-mono">{match.pricePopulaire} MAD</span>
        </span>
        <Link
          to={`/reservation/${match.id}`}
          className={`text-xs font-heading font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-all duration-300 ${
            isFull
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : isAlmostFull
              ? "bg-accent/20 text-accent border border-accent/30 hover:bg-accent/30"
              : "bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 hover:border-primary/50"
          }`}
          onClick={(e) => isFull && e.preventDefault()}
        >
          {isFull ? "COMPLET" : isAlmostFull ? "DERNIÈRES PLACES" : "RÉSERVER →"}
        </Link>
      </div>
    </motion.div>
  );
}
