import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronDown, Trophy, Calendar, Ticket, MapPin, Users, Zap, Star, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import MatchCard from "@/components/match/MatchCard";
import LeagueTable from "@/components/ranking/LeagueTable";
import TeamFlipCard from "@/components/team/TeamFlipCard";
import StadiumCard from "@/components/stadium/StadiumCard";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { Loader2 } from "lucide-react";
import { staggerContainer, staggerItem } from "@/design-system/animations";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const STATS = [
  { icon: Users, label: "Équipes", value: 16, suffix: "" },
  { icon: Calendar, label: "Matchs", value: 240, suffix: "" },
  { icon: Ticket, label: "Billets", value: 50000, suffix: "+" },
  { icon: MapPin, label: "Stades", value: 10, suffix: "" },
];

export default function Home() {
  const { data: matches } = useQuery({
    queryKey: ["matches"],
    queryFn: async () => {
      const res = await api.get("/matches");
      return res.data.data;
    },
  });

  const { data: teams } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const res = await api.get("/teams");
      return res.data.data;
    },
  });

  const { data: stadiums } = useQuery({
    queryKey: ["stadiums"],
    queryFn: async () => {
      const res = await api.get("/stadiums");
      return res.data.data;
    },
  });

  const upcomingMatches = matches?.slice(0, 4) || [];
  const displayTeams = teams?.slice(0, 8) || [];
  const displayStadiums = stadiums?.slice(0, 6) || [];

  const isLoading = !matches || !teams || !stadiums;

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* ═══════════════════════════════════ HERO ═══════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center gradient-hero overflow-hidden">
        {/* Animated orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1.5s" }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gold/3 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "3s" }} />
        </div>

        {/* Grid lines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Animated SVG Football Pitch */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06]">
          <svg viewBox="0 0 600 400" className="w-[80%] max-w-3xl">
            <motion.rect x="50" y="50" width="500" height="300" rx="0" fill="none" stroke="hsl(var(--primary))" strokeWidth="2"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeInOut" }} />
            <motion.line x1="300" y1="50" x2="300" y2="350" stroke="hsl(var(--primary))" strokeWidth="1.5"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.5 }} />
            <motion.circle cx="300" cy="200" r="50" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.8 }} />
            <motion.rect x="50" y="120" width="80" height="160" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 1 }} />
            <motion.rect x="470" y="120" width="80" height="160" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 1.2 }} />
            <motion.rect x="50" y="155" width="40" height="90" fill="none" stroke="hsl(var(--primary))" strokeWidth="1"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 1.4 }} />
            <motion.rect x="510" y="155" width="40" height="90" fill="none" stroke="hsl(var(--primary))" strokeWidth="1"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 1.6 }} />
          </svg>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="container mx-auto px-4 text-center relative z-10"
        >
          <motion.div variants={fadeUp} className="badge-live mb-8 mx-auto w-fit">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            EN DIRECT — BOTOLA PRO INWI · SAISON 2025–2026
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-foreground leading-[0.9] mb-6"
          >
            VIVEZ LA PASSION
            <br />
            <span className="text-primary">DU FOOTBALL</span>
            <br />
            MAROCAIN
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 font-heading tracking-wide"
          >
            Réservez vos billets en quelques secondes.
            <br className="hidden sm:block" />
            QR code · PDF · Livraison instantanée.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/matches" className="btn-neon flex items-center justify-center gap-2">
              <Ticket className="w-4 h-4" />
              Acheter un Billet
            </Link>
            <Link to="/matches" className="btn-outline-neon flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" />
              Voir les Matchs
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-6 h-6 text-primary/50" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════ STATS BAR ═══════════════════════════════════ */}
      <section className="relative -mt-16 z-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="stat-card"
              >
                <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                <div className="font-display text-3xl text-foreground">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════ UPCOMING MATCHES ═══════════════════════════════════ */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="section-tag">
            <Zap className="w-3 h-3" />
            Prochains Matchs
          </span>
          <h2 className="text-display text-4xl md:text-5xl text-foreground">
            MATCHS À LA UNE
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
        >
          {upcomingMatches.map((match) => (
            <motion.div key={match.id} variants={staggerItem}>
              <MatchCard match={match} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link to="/matches" className="btn-outline-neon inline-flex items-center gap-2">
            Voir tous les matchs →
          </Link>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════ LEAGUE TABLE ═══════════════════════════════════ */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="section-tag">
            <Trophy className="w-3 h-3" />
            Classement Officiel
          </span>
          <h2 className="text-display text-4xl md:text-5xl text-foreground">
            BOTOLA PRO INWI
          </h2>
          <p className="text-muted-foreground mt-3 font-heading">Saison 2025–2026</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <LeagueTable />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════ TEAMS ═══════════════════════════════════ */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="section-tag">
            <Shield className="w-3 h-3" />
            Les Clubs
          </span>
          <h2 className="text-display text-4xl md:text-5xl text-foreground">
            ÉQUIPES BOTOLA PRO
          </h2>
          <p className="text-muted-foreground mt-3 font-heading">16 clubs, une seule passion</p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-5xl mx-auto"
        >
          {displayTeams.map((team: any) => (
            <motion.div key={team.id} variants={staggerItem}>
              <TeamFlipCard team={team} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════════════════════════ STADIUMS ═══════════════════════════════════ */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="section-tag">
            <MapPin className="w-3 h-3" />
            Infrastructures
          </span>
          <h2 className="text-display text-4xl md:text-5xl text-foreground">
            STADES DU CHAMPIONNAT
          </h2>
          <p className="text-muted-foreground mt-3 font-heading">10 enceintes à travers le Maroc</p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {displayStadiums.map((stadium: any) => (
            <motion.div key={stadium.id} variants={staggerItem}>
              <StadiumCard stadium={stadium} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════════════════════════ TICKET BANNER ═══════════════════════════════════ */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-premium p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 max-w-5xl mx-auto"
        >
          {/* Left text */}
          <div className="flex-1">
            <span className="badge-gold mb-4">
              <Star className="w-3 h-3" /> Premium
            </span>
            <h2 className="text-display text-3xl md:text-4xl text-foreground mb-4">
              BILLET DIGITAL
              <br />
              <span className="text-primary">INSTANTANÉ</span>
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> QR Code unique & sécurisé
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Téléchargement PDF instantané
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Livraison par email
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> 100% vérifié & non falsifiable
              </p>
            </div>
          </div>

          {/* Right: floating ticket */}
          <motion.div
            animate={{ y: [0, -12, 0], rotate: [-1, 1, -1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="glass p-6 w-64 text-center relative"
            style={{ boxShadow: "var(--shadow-elevated)" }}
          >
            <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary animate-glow" />
            <div className="font-display text-lg text-primary tracking-widest mb-3">BOTOLA TICKET</div>
            <div className="w-20 h-20 bg-foreground/5 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <div className="grid grid-cols-6 gap-px w-14 h-14">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div key={i} className={`${Math.random() > 0.4 ? "bg-foreground/80" : "bg-transparent"} rounded-[1px]`} />
                ))}
              </div>
            </div>
            <p className="font-mono text-[10px] text-muted-foreground">BTK-2026-0847</p>
            <div className="border-t border-border mt-3 pt-3">
              <p className="text-xs font-heading font-semibold text-foreground">RCA vs WAC</p>
              <p className="text-[10px] text-muted-foreground">Stade Mohammed V</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════ CTA ═══════════════════════════════════ */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-premium text-center py-16 px-8 relative overflow-hidden"
        >
          {/* Background orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-20 -left-20 w-60 h-60 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-secondary/5 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <h2 className="text-display text-4xl md:text-6xl text-foreground mb-4">
              PRÊT À VIVRE L'ÉMOTION ?
            </h2>
            <p className="text-muted-foreground mb-8 font-heading text-lg">
              Rejoignez des milliers de supporters à travers le Maroc
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-neon inline-flex items-center gap-2">
                <Users className="w-4 h-4" />
                Créer un compte
              </Link>
              <Link to="/matches" className="btn-outline-neon inline-flex items-center gap-2">
                <Ticket className="w-4 h-4" />
                Explorer les matchs
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
