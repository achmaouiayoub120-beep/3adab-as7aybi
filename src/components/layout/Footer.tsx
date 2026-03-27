import { Link } from "react-router-dom";
import botolaLogo from "@/assets/botola-logo.png";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/40 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={botolaLogo} alt="Botola Pro" className="h-9 w-auto" />
              <span className="font-display text-xl text-foreground">
                BOTOLA <span className="text-primary">TICKET</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              La plateforme officielle de billetterie du championnat Botola Pro Inwi.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-foreground mb-4">Navigation</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Accueil</Link>
              <Link to="/matches" className="text-sm text-muted-foreground hover:text-primary transition-colors">Matchs</Link>
              <Link to="/classement" className="text-sm text-muted-foreground hover:text-primary transition-colors">Classement</Link>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-foreground mb-4">Support</h4>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">FAQ</span>
              <span className="text-sm text-muted-foreground">Contact</span>
              <span className="text-sm text-muted-foreground">Conditions</span>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-foreground mb-4">Saison</h4>
            <p className="text-sm text-muted-foreground">Botola Pro Inwi</p>
            <p className="font-mono text-primary text-lg mt-1">2025–2026</p>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © 2026 Botola Ticket. Tous droits réservés. Projet PFE.
          </p>
        </div>
      </div>
    </footer>
  );
}
