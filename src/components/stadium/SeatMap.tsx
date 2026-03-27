import { motion } from "framer-motion";

type Zone = "VIP" | "TRIBUNE" | "POPULAIRE";

interface SeatMapProps {
    selectedZone: Zone | null;
    onSelectZone: (zone: Zone) => void;
    prices: Record<Zone, number>;
}

const ZONE_CONFIG = {
    VIP: { color: "hsl(43, 90%, 48%)", hoverColor: "hsl(43, 90%, 58%)", label: "VIP", y: 95 },
    TRIBUNE: { color: "hsl(213, 76%, 51%)", hoverColor: "hsl(213, 76%, 61%)", label: "Tribune", y: 65 },
    POPULAIRE: { color: "hsl(152, 100%, 32%)", hoverColor: "hsl(152, 100%, 42%)", label: "Populaire", y: 35 },
};

export default function SeatMap({ selectedZone, onSelectZone, prices }: SeatMapProps) {
    return (
        <div className="glass p-6">
            <h3 className="font-heading font-bold text-foreground text-sm mb-4 uppercase tracking-wider">
                Plan du Stade
            </h3>
            <svg viewBox="0 0 400 200" className="w-full max-w-md mx-auto">
                {/* Stadium outline */}
                <ellipse cx="200" cy="100" rx="190" ry="90" fill="none" stroke="hsl(var(--border))" strokeWidth="1.5" />

                {/* Populaire (outer ring) */}
                <motion.path
                    d="M 20,100 A 180,85 0 0,1 380,100 A 180,85 0 0,1 20,100"
                    fill={selectedZone === "POPULAIRE" ? ZONE_CONFIG.POPULAIRE.hoverColor : ZONE_CONFIG.POPULAIRE.color}
                    fillOpacity={selectedZone === "POPULAIRE" ? 0.4 : 0.15}
                    stroke={ZONE_CONFIG.POPULAIRE.color}
                    strokeWidth={selectedZone === "POPULAIRE" ? 2.5 : 1}
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => onSelectZone("POPULAIRE")}
                    whileHover={{ fillOpacity: 0.35 }}
                />

                {/* Tribune (middle ring) */}
                <motion.ellipse
                    cx="200" cy="100" rx="140" ry="65"
                    fill={selectedZone === "TRIBUNE" ? ZONE_CONFIG.TRIBUNE.hoverColor : ZONE_CONFIG.TRIBUNE.color}
                    fillOpacity={selectedZone === "TRIBUNE" ? 0.4 : 0.15}
                    stroke={ZONE_CONFIG.TRIBUNE.color}
                    strokeWidth={selectedZone === "TRIBUNE" ? 2.5 : 1}
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => onSelectZone("TRIBUNE")}
                    whileHover={{ fillOpacity: 0.35 }}
                />

                {/* VIP (inner rectangle near pitch) */}
                <motion.rect
                    x="130" y="60" width="140" height="80" rx="8"
                    fill={selectedZone === "VIP" ? ZONE_CONFIG.VIP.hoverColor : ZONE_CONFIG.VIP.color}
                    fillOpacity={selectedZone === "VIP" ? 0.5 : 0.2}
                    stroke={ZONE_CONFIG.VIP.color}
                    strokeWidth={selectedZone === "VIP" ? 2.5 : 1}
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => onSelectZone("VIP")}
                    whileHover={{ fillOpacity: 0.45 }}
                />

                {/* Pitch (center) */}
                <rect x="160" y="78" width="80" height="44" rx="4" fill="hsl(var(--primary))" fillOpacity="0.08" stroke="hsl(var(--primary))" strokeWidth="0.5" />
                <line x1="200" y1="78" x2="200" y2="122" stroke="hsl(var(--primary))" strokeWidth="0.3" opacity="0.5" />
                <circle cx="200" cy="100" r="10" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.3" opacity="0.5" />

                {/* Labels */}
                <text x="200" y="103" textAnchor="middle" className="text-[7px] font-bold" fill="hsl(var(--primary))" opacity="0.4">PITCH</text>
                <text x="200" y="94" textAnchor="middle" className="text-[8px] font-bold" fill={ZONE_CONFIG.VIP.color}>VIP</text>
                <text x="200" y="50" textAnchor="middle" className="text-[8px] font-bold" fill={ZONE_CONFIG.TRIBUNE.color}>TRIBUNE</text>
                <text x="200" y="25" textAnchor="middle" className="text-[8px] font-bold" fill={ZONE_CONFIG.POPULAIRE.color}>POPULAIRE</text>
            </svg>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 mt-4">
                {(Object.entries(ZONE_CONFIG) as [Zone, typeof ZONE_CONFIG.VIP][]).map(([key, config]) => (
                    <button
                        key={key}
                        onClick={() => onSelectZone(key)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all duration-200 ${selectedZone === key
                                ? "ring-2 ring-primary bg-primary/5"
                                : "hover:bg-muted"
                            }`}
                    >
                        <span className="w-3 h-3 rounded-full" style={{ background: config.color }} />
                        <span className="text-foreground">{config.label}</span>
                        <span className="font-mono text-muted-foreground">{prices[key]} MAD</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
