import LeagueTable from "@/components/ranking/LeagueTable";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

export default function Classement() {
  return (
    <section className="container mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <span className="section-tag">
          <Trophy className="w-3 h-3" />
          Classement Officiel
        </span>
        <h1 className="text-display text-4xl md:text-5xl text-foreground">
          BOTOLA PRO INWI
        </h1>
        <p className="text-muted-foreground mt-3 font-heading">Saison 2025–2026</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-5xl mx-auto"
      >
        <LeagueTable />
      </motion.div>
    </section>
  );
}
