import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Users, ArrowLeft, Calendar } from "lucide-react";
import { getStadiumById } from "@/data/stadiums";
import { MATCHES } from "@/data/matches";
import MatchCard from "@/components/match/MatchCard";
import { staggerContainer, staggerItem } from "@/design-system/animations";

export default function StadiumDetails() {
  const { id } = useParams<{ id: string }>();
  const stadium = getStadiumById(Number(id));
  
  const stadiumMatches = MATCHES.filter(m => m.stadiumId === Number(id));

  if (!stadium) {
    return (
      <div className="min-h-screen pt-32 pb-16 px-4 text-center">
        <h1 className="text-3xl font-display font-bold text-foreground mb-4">Stade introuvable</h1>
        <Link to="/stadiums" className="btn-outline-neon px-6 py-2 inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Retour aux stades
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/stadiums" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 font-medium">
          <ArrowLeft className="w-4 h-4" /> 
          Retour aux stades
        </Link>
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-3xl overflow-hidden mb-16 flex flex-col md:flex-row relative"
          style={{ border: "1px solid hsl(152 100% 50% / 0.15)" }}
        >
          <div className="md:w-1/2 relative min-h-[300px] md:min-h-full">
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 md:from-transparent to-transparent md:to-background/90 z-10" />
            <img 
              src={stadium.image} 
              alt={stadium.name} 
              className="w-full h-full object-cover absolute inset-0"
            />
          </div>
          
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative z-20">
            <div className="inline-block bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 w-max">
              {stadium.city}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white drop-shadow-md">
              {stadium.name}
            </h1>
            
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              {stadium.description}
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="glass p-4 rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Capacité</p>
                  <p className="text-xl font-display font-bold text-foreground">{stadium.capacity.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="glass p-4 rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Ville</p>
                  <p className="text-xl font-display font-bold text-foreground">{stadium.city}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Section: Map & Matches */}
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Left Column: Matches */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <Calendar className="w-6 h-6 text-primary" />
              <h2 className="text-3xl font-display font-bold">Matchs Programmés</h2>
            </div>
            
            {stadiumMatches.length === 0 ? (
              <div className="glass-card p-12 text-center rounded-2xl border border-white/5">
                <p className="text-muted-foreground text-lg">Aucun match n'est actuellement programmé dans ce stade.</p>
              </div>
            ) : (
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {stadiumMatches.map((match) => (
                  <motion.div key={match.id} variants={staggerItem}>
                    <MatchCard match={match} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
          
          {/* Right Column: Location Map */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-8">
              <MapPin className="w-6 h-6 text-primary" />
              <h2 className="text-3xl font-display font-bold">Localisation</h2>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass-card rounded-2xl overflow-hidden h-[400px] lg:h-[calc(100%-4rem)] border border-white/5"
            >
              <iframe
                src={stadium.location}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale hover:grayscale-0 transition-all duration-500 opacity-80 hover:opacity-100"
              />
            </motion.div>
          </div>
          
        </div>

      </div>
    </div>
  );
}
