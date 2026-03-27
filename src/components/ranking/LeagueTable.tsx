import { motion } from "framer-motion";
import { RANKING } from "@/data/ranking";
import { getTeamById } from "@/data/teams";
import { Trophy } from "lucide-react";
import TeamLogo from "@/components/TeamLogo";

function FormBadge({ form }: { form: ("W" | "D" | "L")[] }) {
  const colorMap = { W: "bg-primary", D: "bg-muted-foreground", L: "bg-accent" };
  return (
    <div className="flex gap-1">
      {form.map((r, i) => (
        <div key={i} className={`w-5 h-5 rounded-full ${colorMap[r]} flex items-center justify-center text-[9px] font-bold text-primary-foreground`}>
          {r}
        </div>
      ))}
    </div>
  );
}

export default function LeagueTable() {
  return (
    <div className="glass overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
              <th className="text-left py-4 px-4 font-semibold">#</th>
              <th className="text-left py-4 px-2 font-semibold">Club</th>
              <th className="text-center py-4 px-2 font-semibold">MJ</th>
              <th className="text-center py-4 px-2 font-semibold">G</th>
              <th className="text-center py-4 px-2 font-semibold">N</th>
              <th className="text-center py-4 px-2 font-semibold">P</th>
              <th className="text-center py-4 px-2 font-semibold">BP</th>
              <th className="text-center py-4 px-2 font-semibold">BC</th>
              <th className="text-center py-4 px-2 font-semibold">Diff</th>
              <th className="text-center py-4 px-2 font-semibold">Pts</th>
              <th className="text-left py-4 px-2 font-semibold hidden md:table-cell">Forme</th>
            </tr>
          </thead>
          <tbody>
            {RANKING.map((entry, idx) => {
              const team = getTeamById(entry.teamId);
              const isChampion = entry.rank <= 2;
              const isRelegation = entry.rank >= 15;

              return (
                <motion.tr
                  key={entry.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.4 }}
                  className={`border-b border-border/50 transition-colors hover:bg-primary/5 ${
                    isChampion ? "bg-primary/[0.03]" : isRelegation ? "bg-accent/[0.03]" : ""
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      {entry.rank === 1 && <Trophy className="w-3.5 h-3.5 text-gold" />}
                      <span className={`font-mono font-bold text-sm ${
                        isChampion ? "text-primary" : isRelegation ? "text-accent" : "text-muted-foreground"
                      }`}>
                        {entry.rank}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      {team && <TeamLogo team={team} size={28} />}
                      <span className="font-heading font-semibold text-foreground text-sm whitespace-nowrap">{entry.club}</span>
                    </div>
                  </td>
                  <td className="text-center py-3 px-2 font-mono text-xs text-muted-foreground">{entry.mj}</td>
                  <td className="text-center py-3 px-2 font-mono text-xs text-foreground">{entry.g}</td>
                  <td className="text-center py-3 px-2 font-mono text-xs text-muted-foreground">{entry.n}</td>
                  <td className="text-center py-3 px-2 font-mono text-xs text-muted-foreground">{entry.p}</td>
                  <td className="text-center py-3 px-2 font-mono text-xs text-muted-foreground">{entry.bp}</td>
                  <td className="text-center py-3 px-2 font-mono text-xs text-muted-foreground">{entry.bc}</td>
                  <td className="text-center py-3 px-2 font-mono text-xs font-semibold">
                    <span className={entry.diff > 0 ? "text-primary" : entry.diff < 0 ? "text-accent" : "text-muted-foreground"}>
                      {entry.diff > 0 ? `+${entry.diff}` : entry.diff}
                    </span>
                  </td>
                  <td className="text-center py-3 px-2">
                    <span className="font-mono font-bold text-foreground text-sm">{entry.pts}</span>
                  </td>
                  <td className="py-3 px-2 hidden md:table-cell">
                    <FormBadge form={entry.form} />
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
