import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Users } from "lucide-react";
import { STADIUMS } from "@/data/stadiums";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Stadiums() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight">
          LES STADES DE LA <span className="text-primary">BOTOLA PRO</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Découvrez les enceintes mythiques qui font vibrer le football marocain chaque week-end.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {STADIUMS.map((stadium) => (
          <motion.div key={stadium.id} variants={item} className="h-full">
            <Link to={`/stadiums/${stadium.id}`} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl">
              <div className="glass-card overflow-hidden h-full rounded-2xl flex flex-col group hover:-translate-y-1 transition-transform duration-300">
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent z-10" />
                  <img
                    src={stadium.image}
                    alt={stadium.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute bottom-4 left-4 z-20">
                    <h3 className="text-xl font-bold text-white mb-1 font-display drop-shadow-md">
                      {stadium.name}
                    </h3>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow relative">
                  <div className="absolute -top-4 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-lg z-20 transform -translate-y-1/2">
                    {stadium.city}
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 mt-2">
                    {stadium.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground gap-1.5">
                      <Users className="w-4 h-4 text-primary" />
                      <span>{stadium.capacity.toLocaleString()} places</span>
                    </div>
                    <div className="flex items-center text-muted-foreground gap-1.5">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{stadium.city}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-sm font-medium text-white group-hover:text-primary transition-colors">
                      Voir détails
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <svg className="w-4 h-4 text-white group-hover:text-primary transition-colors transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
