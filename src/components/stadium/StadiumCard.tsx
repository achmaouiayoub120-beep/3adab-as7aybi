import { motion } from "framer-motion";
import { MapPin, Users } from "lucide-react";
import type { Stadium } from "@/data/stadiums";

export default function StadiumCard({ stadium }: { stadium: Stadium }) {
    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="glass-premium p-6 cursor-pointer group"
        >
            {/* Stadium icon / visual */}
            <div className="w-full h-32 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center mb-4 overflow-hidden relative">
                <svg viewBox="0 0 200 100" className="w-32 h-16 text-primary/20">
                    <ellipse cx="100" cy="60" rx="90" ry="35" fill="none" stroke="currentColor" strokeWidth="2" />
                    <ellipse cx="100" cy="50" rx="90" ry="35" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                    <line x1="100" y1="25" x2="100" y2="85" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                    <circle cx="100" cy="55" r="15" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <h3 className="font-heading font-bold text-foreground text-base mb-1">{stadium.name}</h3>
            <span className="text-xs text-muted-foreground flex items-center gap-1 mb-4">
                <MapPin className="w-3 h-3" />
                {stadium.city}
            </span>

            {/* Capacity bar */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        Capacité
                    </span>
                    <span className="font-mono font-bold text-foreground">
                        {stadium.capacity.toLocaleString()}
                    </span>
                </div>
                <div className="capacity-bar">
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="capacity-bar-fill low"
                    />
                </div>
            </div>
        </motion.div>
    );
}
