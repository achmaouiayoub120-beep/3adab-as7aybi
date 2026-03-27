import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Lock, ArrowRight, Zap } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = (location.state as any)?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Veuillez remplir tous les champs.");
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Bienvenue, ${user.firstName} !`);
      navigate(user.role === "ADMIN" ? "/admin" : from !== "/login" ? from : "/dashboard", { replace: true });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Identifiants incorrects.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glass-premium p-8 md:p-10 w-full max-w-md relative overflow-hidden"
      >
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-8 relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4"
          >
            <Zap className="w-7 h-7 text-primary" />
          </motion.div>
          <h1 className="text-display text-3xl text-foreground">CONNEXION</h1>
          <p className="text-muted-foreground text-sm font-heading mt-2">
            Accédez à votre espace Botola Ticket
          </p>
        </div>

        <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/20 text-sm">
          <p className="font-bold text-foreground mb-2 flex items-center gap-2">
            <User className="w-4 h-4 text-primary" /> Comptes de Démonstration (PFE)
          </p>
          <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Admin: <strong className="text-foreground">admin@botola.ma</strong></span>
              <span className="font-mono">Admin2026!</span>
            </div>
            <div className="flex justify-between">
              <span>User: <strong className="text-foreground">user@botola.ma</strong></span>
              <span className="font-mono">User2026!</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">
              Email
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="votre@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.98 }}
            className="btn-neon w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-pulse">Connexion en cours...</span>
            ) : (
              <>
                Se Connecter <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-6 text-center relative z-10">
          <p className="text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link to="/register" className="text-primary hover:underline font-medium">
              Créer un compte
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
