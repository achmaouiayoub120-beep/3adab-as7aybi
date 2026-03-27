import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Check, CreditCard, Download, ArrowLeft, ArrowRight, Share2, Home, Wallet, Building, Loader2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import ReactConfetti from "react-confetti";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import TeamLogo from "@/components/TeamLogo";
import SeatMap from "@/components/stadium/SeatMap";
import { useTicketPDF } from "@/hooks/useTicketPDF";

type Zone = "VIP" | "TRIBUNE" | "POPULAIRE";
type PaymentMethod = "card" | "cmi" | "paypal";

const STEPS = ["Sièges", "Confirmation", "Paiement", "Billet"];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          <motion.div
            animate={{
              scale: i === current ? 1.1 : 1,
              backgroundColor: i < current ? "hsl(var(--primary))" : i === current ? "hsl(var(--primary) / 0.2)" : "hsl(var(--muted))",
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${i < current ? "text-primary-foreground" :
                i === current ? "text-primary border-2 border-primary" :
                  "text-muted-foreground"
              }`}
          >
            {i < current ? <Check className="w-4 h-4" /> : i + 1}
          </motion.div>
          <span className={`text-xs font-heading hidden sm:inline ${i === current ? "text-primary font-semibold" : "text-muted-foreground"}`}>
            {step}
          </span>
          {i < STEPS.length - 1 && (
            <div className={`w-8 md:w-12 h-0.5 rounded-full transition-colors duration-300 ${i < current ? "bg-primary" : "bg-muted"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function Reservation() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const { generatePDF } = useTicketPDF();
  const { user } = useAuth();

  const [step, setStep] = useState(0);
  const [zone, setZone] = useState<Zone | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  // Completed Reservation Payload
  const [completedReservations, setCompletedReservations] = useState<any>(null);

  // Form state
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardFlipped, setCardFlipped] = useState(false);

  // Fetch Match Details dynamically from DB
  const { data: matchData, isLoading, error } = useQuery({
    queryKey: ["match", matchId],
    queryFn: async () => {
      const res = await api.get(`/matches/${matchId}`);
      return res.data.data;
    },
    enabled: !!matchId,
  });

  const reservationMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        matchId: Number(matchId),
        zone,
        quantity,
        paymentMethod
      };
      const res = await api.post("/reservations", payload);
      return res.data.data;
    },
    onSuccess: (data) => {
      setProcessing(false);
      setCompletedReservations(data);
      setShowConfetti(true);
      setStep(3);
      setTimeout(() => setShowConfetti(false), 5000);
      toast.success("Réservation confirmée avec succès !");
    },
    onError: (err: any) => {
      setProcessing(false);
      toast.error(err.response?.data?.message || "Erreur lors de la réservation");
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !matchData) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center flex-col gap-4">
        <p className="text-muted-foreground text-lg">Match introuvable.</p>
        <button onClick={() => navigate("/matches")} className="btn-outline-neon">Retourner aux Matchs</button>
      </div>
    );
  }

  const match = matchData;
  const home = match?.homeTeam;
  const away = match?.awayTeam;
  const stadium = match?.stadium;

  const prices: Record<Zone, number> = {
    VIP: match?.priceVip || 0,
    TRIBUNE: match?.priceTribune || 0,
    POPULAIRE: match?.pricePopulaire || 0,
  };
  const total = zone ? prices[zone] * quantity : 0;

  const formatCard = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const handlePayment = () => {
    setProcessing(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Trigger backend reservation creation
          reservationMutation.mutate();
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleDownloadPDF = () => {
      if (!completedReservations) return;
      const t = completedReservations.tickets?.[0]; // Sample first ticket if multiple
      if (!t) return;
      
      const dateObj = new Date(match?.date || "");
      generatePDF({
        ticketId: t.ticketCode,
        homeName: home?.name || "",
        awayName: away?.name || "",
        homeShort: home?.shortName || "",
        awayShort: away?.shortName || "",
        stadiumName: stadium?.name || "",
        stadiumCity: stadium?.city || "",
        date: dateObj.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
        time: dateObj.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        zone: t.zone,
        quantity, // We can put total quantity or 1 since a ticket is for 1
        totalPrice: (total || 0) / quantity,
      });
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      {showConfetti && <ReactConfetti recycle={false} numberOfPieces={300} />}

      <div className="container mx-auto px-4 max-w-3xl">
        <button onClick={() => step > 0 ? setStep(step - 1) : navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>

        {/* Match header */}
        <div className="glass-premium p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <TeamLogo team={home} size={36} />
            <span className="font-heading font-bold text-foreground text-sm">
              {home?.shortName} vs {away?.shortName}
            </span>
            <TeamLogo team={away} size={36} />
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-3">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{stadium?.name}</span>
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{match?.date ? new Date(match.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) : ""}</span>
          </div>
        </div>

        <StepIndicator current={step} />

        <AnimatePresence mode="wait">
          {/* ═══ STEP 0: Zone Selection with Seat Map ═══ */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
              <h2 className="text-display text-3xl text-foreground mb-6">CHOISISSEZ VOTRE ZONE</h2>

              {/* Seat Map */}
              <SeatMap selectedZone={zone} onSelectZone={setZone} prices={prices} />

              {zone && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-6 mt-6">
                  <label className="text-sm font-heading text-foreground mb-3 block">Nombre de billets</label>
                  <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg bg-muted text-foreground font-bold hover:bg-muted/80 transition-colors">-</button>
                    <span className="font-mono text-2xl text-foreground w-8 text-center">{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(10, quantity + 1))} className="w-10 h-10 rounded-lg bg-muted text-foreground font-bold hover:bg-muted/80 transition-colors">+</button>
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="font-mono text-2xl text-primary font-bold">{total} MAD</span>
                  </div>
                  <button disabled={quantity > match.seatsAvailable} onClick={() => setStep(1)} className="btn-neon w-full mt-6 flex items-center justify-center gap-2">
                    Continuer <ArrowRight className="w-4 h-4" />
                  </button>
                  {quantity > match.seatsAvailable && (
                    <p className="text-red-500 text-xs mt-2 text-center">Seats available limit reached ({match.seatsAvailable} available).</p>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ═══ STEP 1: Confirmation ═══ */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
              <h2 className="text-display text-3xl text-foreground mb-6">RÉCAPITULATIF</h2>

              {/* User info form */}
              <div className="glass p-6 mb-6 space-y-4">
                <h3 className="font-heading font-bold text-foreground text-sm uppercase tracking-wider">Vos coordonnées</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Prénom</label>
                    <input disabled value={user?.firstName} className="w-full bg-muted/60 opacity-80 cursor-not-allowed rounded-lg px-4 py-2.5 text-foreground text-sm outline-none" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Nom</label>
                    <input disabled value={user?.lastName} className="w-full bg-muted/60 opacity-80 cursor-not-allowed rounded-lg px-4 py-2.5 text-foreground text-sm outline-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Email</label>
                    <input disabled value={user?.email} className="w-full bg-muted/60 opacity-80 cursor-not-allowed rounded-lg px-4 py-2.5 text-foreground text-sm outline-none" />
                  </div>
                </div>
              </div>

              {/* Order summary */}
              <div className="glass p-6 space-y-3">
                <h3 className="font-heading font-bold text-foreground text-sm uppercase tracking-wider mb-3">Détails de la commande</h3>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Match</span><span className="text-foreground font-medium">{home?.name} vs {away?.name}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Stade</span><span className="text-foreground">{stadium?.name}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Date</span><span className="text-foreground">{match?.date ? new Date(match.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : ""}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Zone</span><span className="text-foreground font-bold">{zone}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Quantité</span><span className="text-foreground">{quantity}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Prix unitaire</span><span className="text-foreground font-mono">{zone ? prices[zone] : 0} MAD</span></div>
                <div className="border-t border-border pt-4 flex justify-between">
                  <span className="font-heading font-semibold text-foreground">Total TTC</span>
                  <span className="font-mono text-2xl text-primary font-bold">{total} MAD</span>
                </div>
              </div>

              {/* CGV */}
              <label className="flex items-start gap-3 mt-4 text-xs text-muted-foreground cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-0.5 rounded border-border accent-primary" />
                J'accepte les conditions générales de vente et la politique de confidentialité de Botola Ticket.
              </label>

              <button onClick={() => setStep(2)} className="btn-neon w-full mt-6 flex items-center justify-center gap-2">
                Procéder au paiement <CreditCard className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* ═══ STEP 2: Payment ═══ */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
              <h2 className="text-display text-3xl text-foreground mb-6">PAIEMENT</h2>

              {/* Payment method tabs */}
              <div className="flex rounded-xl bg-muted p-1 mb-6">
                {[
                  { key: "card" as PaymentMethod, icon: CreditCard, label: "Carte Bancaire" },
                  { key: "cmi" as PaymentMethod, icon: Building, label: "CMI Maroc" },
                  { key: "paypal" as PaymentMethod, icon: Wallet, label: "PayPal" },
                ].map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setPaymentMethod(m.key)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-heading font-semibold transition-all duration-300 ${paymentMethod === m.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <m.icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{m.label}</span>
                  </button>
                ))}
              </div>

              {/* Credit card visual */}
              <div className="perspective-1000 mb-6">
                <motion.div
                  animate={{ rotateY: cardFlipped ? 180 : 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full max-w-sm mx-auto h-48"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Front */}
                  <div className="absolute inset-0 rounded-2xl p-6 text-white"
                    style={{ backfaceVisibility: "hidden", background: "linear-gradient(135deg, #1E3A5F 0%, #0D1628 100%)" }}
                  >
                    <div className="font-mono text-[10px] tracking-wider opacity-60 mb-8">DEBIT CARD</div>
                    <div className="font-mono text-lg tracking-[0.2em] mb-6">
                      {cardNumber || "•••• •••• •••• ••••"}
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-[8px] opacity-40 uppercase">Titulaire</div>
                        <div className="text-xs font-mono">{`${user?.firstName?.slice(0, 1) || ''}. ${user?.lastName || ''}`.toUpperCase()}</div>
                      </div>
                      <div>
                        <div className="text-[8px] opacity-40 uppercase">Expire</div>
                        <div className="text-xs font-mono">{expiry || "MM/YY"}</div>
                      </div>
                    </div>
                  </div>
                  {/* Back */}
                  <div className="absolute inset-0 rounded-2xl text-white overflow-hidden"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "linear-gradient(135deg, #0D1628 0%, #1E3A5F 100%)" }}
                  >
                    <div className="w-full h-10 bg-black/40 mt-8" />
                    <div className="px-6 mt-4 flex items-center gap-3">
                      <div className="flex-1 h-8 bg-white/10 rounded flex items-center justify-end px-3">
                        <span className="font-mono text-sm">{cvv || "•••"}</span>
                      </div>
                      <span className="text-[8px] opacity-40">CVV</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Card form */}
              <div className="glass p-6 space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Numéro de carte</label>
                  <input
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCard(e.target.value))}
                    onFocus={() => setCardFlipped(false)}
                    className="w-full bg-muted rounded-lg px-4 py-3 text-foreground font-mono text-sm outline-none focus:ring-2 focus:ring-primary"
                    placeholder="4242 4242 4242 4242"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Expiration</label>
                    <input
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      onFocus={() => setCardFlipped(false)}
                      className="w-full bg-muted rounded-lg px-4 py-3 text-foreground font-mono text-sm outline-none focus:ring-2 focus:ring-primary"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">CVV</label>
                    <input
                      type="password"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                      onFocus={() => setCardFlipped(true)}
                      onBlur={() => setCardFlipped(false)}
                      className="w-full bg-muted rounded-lg px-4 py-3 text-foreground font-mono text-sm outline-none focus:ring-2 focus:ring-primary"
                      placeholder="•••"
                    />
                  </div>
                </div>
                <div className="border-t border-border pt-4 flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Montant à payer</span>
                  <span className="font-mono text-xl text-primary font-bold">{total} MAD</span>
                </div>
              </div>

              {/* Progress bar during processing */}
              {processing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${progress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                  <p className="text-xs text-center text-muted-foreground mt-2 font-heading">Traitement sécurisé... {progress}%</p>
                </motion.div>
              )}

              <button
                onClick={handlePayment}
                disabled={processing}
                className="btn-neon w-full mt-6 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {processing ? (
                  <div className="flex items-center gap-2">
                    <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-2 h-2 rounded-full bg-primary-foreground" />
                    <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 rounded-full bg-primary-foreground" />
                    <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 rounded-full bg-primary-foreground" />
                    <span className="ml-2">Paiement en cours...</span>
                  </div>
                ) : (
                  <>Payer {total} MAD</>
                )}
              </button>
            </motion.div>
          )}

          {/* ═══ STEP 3: Success + Ticket ═══ */}
          {step === 3 && completedReservations && (
            <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, type: "spring" }}>
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4"
                >
                  <Check className="w-10 h-10 text-primary" />
                </motion.div>
                <h2 className="text-display text-4xl text-foreground">RÉSERVATION CONFIRMÉE !</h2>
                <p className="text-muted-foreground text-sm mt-2 font-heading">Votre réservation a été générée avec succès</p>
              </div>

              {/* Premium Ticket Render Map */}
              <div className="space-y-6">
                {completedReservations.tickets.map((t: any, index: number) => (
                    <motion.div
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + (index * 0.1), type: "spring" }}
                    key={t.id}
                    className="glass-premium p-8 max-w-md mx-auto text-center relative overflow-hidden"
                  >
                    {/* Top decoration */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-primary" />

                    <div className="font-display text-xl text-primary tracking-widest mb-6">BOTOLA TICKET {index+1}/{completedReservations.tickets.length}</div>

                    {/* Teams */}
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <TeamLogo team={home} size={44} />
                      <span className="text-display text-2xl text-muted-foreground">VS</span>
                      <TeamLogo team={away} size={44} />
                    </div>
                    <p className="font-heading font-semibold text-foreground text-sm mb-1">{home?.name} vs {away?.name}</p>

                    <div className="border-t border-border my-4" />

                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">
                        📅 {match?.date ? new Date(match.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : ""} · {match?.date ? new Date(match.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : ""}
                      </p>
                      <p className="text-muted-foreground">🏟️ {stadium?.name}, {stadium?.city}</p>
                      <p className="text-foreground font-semibold">🎫 {t.zone} · {1} billet(s)</p>
                      <p className="text-muted-foreground">👤 {user?.firstName} {user?.lastName} · {user?.email}</p>
                    </div>

                    <div className="border-t border-border my-4" />

                    {/* QR Code */}
                    <div className="flex justify-center mb-3">
                      <div className="p-3 bg-white rounded-xl">
                        <QRCodeSVG
                          value={t.qrData || t.ticketCode}
                          size={128}
                          level="H"
                          includeMargin={false}
                        />
                      </div>
                    </div>

                    <p className="font-mono text-xs text-primary font-bold">{t.ticketCode}</p>
                    <p className="font-mono text-sm text-foreground font-bold mt-2">{total / quantity} MAD</p>

                    <div className="border-t border-border mt-4 pt-3">
                      <p className="text-[10px] text-muted-foreground">🔒 Billet vérifié · Non remboursable · Botola Pro Inwi 2025–2026</p>
                    </div>
                  </motion.div>
                ))}
              </div>


              {/* Actions */}
              <div className="flex flex-wrap gap-4 justify-center mt-8">
                <button onClick={handleDownloadPDF} className="btn-neon flex items-center gap-2">
                  <Download className="w-4 h-4" /> Télécharger PDF
                </button>
                <button onClick={() => navigate("/dashboard")} className="btn-outline-neon flex items-center gap-2">
                  <Home className="w-4 h-4" /> Mes Billets
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
