import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Ticket, Clock, User, LogOut, QrCode, Download, Calendar, MapPin, ChevronRight, Loader2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import TeamLogo from "@/components/TeamLogo";
import { staggerContainer, staggerItem } from "@/design-system/animations";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { useTicketPDF } from "@/hooks/useTicketPDF";

type Tab = "overview" | "tickets" | "history" | "profile";

const TABS: { key: Tab; label: string; icon: typeof Home }[] = [
    { key: "overview", label: "Vue d'ensemble", icon: Home },
    { key: "tickets", label: "Mes Billets", icon: Ticket },
    { key: "history", label: "Historique", icon: Clock },
    { key: "profile", label: "Profil", icon: User },
];

function TicketCard({ reservation, ticket }: { reservation: any; ticket: any }) {
    const [showQR, setShowQR] = useState(false);
    const { generatePDF } = useTicketPDF();
    const isUpcoming = reservation.match.status === "SCHEDULED";

    const fetchDetailedQR = async () => {
        // Fallback simple QR content, but ideally API returns detailed qrData in ticket
        return ticket.qrData || JSON.stringify({ code: ticket.ticketCode });
    };

    const handleDownload = () => {
        const dateObj = new Date(reservation.match.date);
        generatePDF({
            ticketId: ticket.ticketCode,
            homeName: reservation.match.homeTeam.name,
            awayName: reservation.match.awayTeam.name,
            homeShort: reservation.match.homeTeam.shortName,
            awayShort: reservation.match.awayTeam.shortName,
            stadiumName: reservation.match.stadium.name,
            stadiumCity: reservation.match.stadium.city,
            date: dateObj.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
            time: dateObj.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
            zone: ticket.zone,
            quantity: 1, // Individual ticket
            totalPrice: reservation.totalPrice / reservation.quantity,
        });
    };

    return (
        <motion.div whileHover={{ y: -3 }} className="glass p-5 relative overflow-hidden flex flex-col justify-between h-full">
            <div>
                {/* Status badge */}
                <div className="absolute top-3 right-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${isUpcoming ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        {isUpcoming ? "À venir" : "Passé"}
                    </span>
                </div>

                {/* Teams */}
                <div className="flex items-center gap-3 mb-3">
                    <TeamLogo team={reservation.match.homeTeam} size={32} />
                    <span className="text-xs font-heading font-bold text-foreground">{reservation.match.homeTeam.shortName} vs {reservation.match.awayTeam.shortName}</span>
                    <TeamLogo team={reservation.match.awayTeam} size={32} />
                </div>

                {/* Info */}
                <div className="space-y-1 text-xs text-muted-foreground mb-3">
                    <p className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(reservation.match.date).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}
                    </p>
                    <p className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {reservation.match.stadium.name}
                    </p>
                    <p className="font-semibold text-foreground">
                        🎫 {ticket.zone} · <span className="font-mono text-primary">{reservation.totalPrice / reservation.quantity} MAD</span>
                    </p>
                </div>
            </div>

            {/* Actions & QR */}
            <div className="mt-auto pt-2">
                <AnimatePresence>
                    {showQR && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="flex justify-center mb-3 overflow-hidden"
                        >
                            <div className="p-2 bg-white rounded-lg">
                                <QRCodeSVG value={ticket.qrData || ticket.ticketCode} size={100} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex gap-2">
                    <button onClick={() => setShowQR(!showQR)} className="flex-1 flex items-center justify-center gap-1 text-[10px] font-heading font-bold text-primary border border-primary/20 rounded-lg py-1.5 hover:bg-primary/5 transition-colors">
                        <QrCode className="w-3 h-3" />
                        {showQR ? "Masquer" : "QR Code"}
                    </button>
                    <button onClick={handleDownload} className="flex-1 flex items-center justify-center gap-1 text-[10px] font-heading font-bold text-foreground border border-border rounded-lg py-1.5 hover:bg-muted transition-colors">
                        <Download className="w-3 h-3" />
                        PDF
                    </button>
                </div>
                <p className="font-mono text-[9px] text-muted-foreground mt-2 text-center">{ticket.ticketCode}</p>
            </div>
        </motion.div>
    );
}

export default function UserDashboard() {
    const { user, logout, updateProfile } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>("overview");
    const [isUpdating, setIsUpdating] = useState(false);
    const queryClient = useQueryClient();

    // Profile form state
    const [firstName, setFirstName] = useState(user?.firstName || "");
    const [lastName, setLastName] = useState(user?.lastName || "");
    const [phone, setPhone] = useState(user?.phone || "");

    const { data: reservationsResponse, isLoading } = useQuery({
        queryKey: ["myReservations"],
        queryFn: async () => {
            const res = await api.get("/reservations/mine");
            return res.data;
        },
    });

    const cancelMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await api.patch(`/reservations/${id}/cancel`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["myReservations"] });
            toast.success("Réservation annulée avec succès.");
        },
        onError: (err: any) => toast.error(err.response?.data?.message || "Erreur lors de l'annulation")
    });

    const reservations = reservationsResponse?.data || [];
    const allTickets = reservations
        .filter((r: any) => r.status === "CONFIRMED")
        .flatMap((r: any) => r.tickets.map((t: any) => ({ ...t, reservation: r })));
    
    const upcomingTickets = allTickets.filter((t: any) => new Date(t.reservation.match.date) > new Date());
    const pastTickets = allTickets.filter((t: any) => new Date(t.reservation.match.date) <= new Date());

    const totalSpent = reservations
        .filter((r: any) => r.status === "CONFIRMED")
        .reduce((acc: number, r: any) => acc + r.totalPrice, 0);

    const KPIS = [
        { label: "Billets Actifs", value: upcomingTickets.length, icon: Ticket, color: "text-primary" },
        { label: "Matchs à Venir", value: new Set(upcomingTickets.map((t: any) => t.reservation.matchId)).size, icon: Calendar, color: "text-secondary" },
        { label: "Total Billets", value: allTickets.length, icon: Ticket, color: "text-gold" },
        { label: "Total Dépensé", value: totalSpent, suffix: " MAD", icon: Download, color: "text-accent" },
    ];

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            await updateProfile({ firstName, lastName, phone });
            toast.success("Profil mis à jour avec succès.");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Erreur de mise à jour.");
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center pt-20 pb-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
    }

    return (
        <div className="min-h-screen pt-20 pb-16">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
                    {/* ═══ SIDEBAR ═══ */}
                    <aside className="lg:w-64 shrink-0">
                        <div className="glass p-5 lg:sticky lg:top-24">
                            {/* Avatar */}
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                                    <User className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="font-heading font-bold text-foreground">{user?.firstName} {user?.lastName}</h3>
                                <p className="text-xs text-muted-foreground">{user?.email}</p>
                            </div>

                            <div className="border-t border-border pt-4 space-y-1">
                                {TABS.map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-heading font-medium transition-all duration-200 ${activeTab === tab.key
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                            }`}
                                    >
                                        <tab.icon className="w-4 h-4" />
                                        {tab.label}
                                        {activeTab === tab.key && <ChevronRight className="w-3 h-3 ml-auto" />}
                                    </button>
                                ))}

                                <div className="border-t border-border pt-2 mt-2">
                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-heading font-medium text-destructive hover:bg-destructive/10 transition-all"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Déconnexion
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* ═══ MAIN CONTENT ═══ */}
                    <main className="flex-1">
                        <AnimatePresence mode="wait">
                            {/* OVERVIEW */}
                            {activeTab === "overview" && (
                                <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                                    <h1 className="text-display text-3xl text-foreground mb-6">MON ESPACE</h1>

                                    {/* KPIs */}
                                    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                        {KPIS.map((kpi) => (
                                            <motion.div key={kpi.label} variants={staggerItem} className="glass p-4 text-center">
                                                <kpi.icon className={`w-5 h-5 mx-auto mb-2 ${kpi.color}`} />
                                                <div className="font-display text-2xl text-foreground">
                                                    <AnimatedCounter target={kpi.value} suffix={kpi.suffix || ""} />
                                                </div>
                                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{kpi.label}</p>
                                            </motion.div>
                                        ))}
                                    </motion.div>

                                    {/* Recent tickets */}
                                    <h2 className="font-heading font-bold text-foreground text-lg mb-4">Mes futurs matchs</h2>
                                    {upcomingTickets.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                            {upcomingTickets.map((ticket: any) => (
                                                <TicketCard key={ticket.id} reservation={ticket.reservation} ticket={ticket} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="glass p-8 text-center text-muted-foreground">
                                            Aucun match à venir. <a href="/matches" className="text-primary hover:underline">Réserver un billet</a>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* TICKETS */}
                            {activeTab === "tickets" && (
                                <motion.div key="tickets" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                                    <h1 className="text-display text-3xl text-foreground mb-6">TOUS MES BILLETS</h1>
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                        {allTickets.map((ticket: any) => (
                                            <TicketCard key={ticket.id} reservation={ticket.reservation} ticket={ticket} />
                                        ))}
                                        {allTickets.length === 0 && (
                                            <div className="col-span-1 md:col-span-2 xl:col-span-3 glass p-8 text-center text-muted-foreground">
                                                Vous n'avez pas encore acheté de billets.
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* HISTORY */}
                            {activeTab === "history" && (
                                <motion.div key="history" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                                    <h1 className="text-display text-3xl text-foreground mb-6">HISTORIQUE DES RÉSERVATIONS</h1>
                                    <div className="glass overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                                                    <th className="text-left py-3 px-4">Commande</th>
                                                    <th className="text-left py-3 px-2">Match</th>
                                                    <th className="text-center py-3 px-2">Zone</th>
                                                    <th className="text-center py-3 px-2">Qte</th>
                                                    <th className="text-center py-3 px-2">Prix</th>
                                                    <th className="text-center py-3 px-2">Statut</th>
                                                    <th className="text-right py-3 px-4">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reservations.map((r: any) => {
                                                    const h = r.match.homeTeam;
                                                    const a = r.match.awayTeam;
                                                    const canCancel = r.status === "CONFIRMED" && new Date(r.match.date) > new Date();
                                                    return (
                                                        <tr key={r.id} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                                                            <td className="py-3 px-4 font-mono text-xs text-primary">{r.id.split('-').pop() || r.id}</td>
                                                            <td className="py-3 px-2 text-xs font-heading">{h.shortName} vs {a.shortName}</td>
                                                            <td className="text-center py-3 px-2 text-xs">{r.zone}</td>
                                                            <td className="text-center py-3 px-2 text-xs">{r.quantity}</td>
                                                            <td className="text-center py-3 px-2 font-mono text-xs">{r.totalPrice} MAD</td>
                                                            <td className="text-center py-3 px-2">
                                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${r.status === "CONFIRMED" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                                                                    {r.status === "CONFIRMED" ? "Confirmé" : "Annulé"}
                                                                </span>
                                                            </td>
                                                            <td className="text-right py-3 px-4">
                                                                {canCancel && (
                                                                    <button 
                                                                        onClick={() => { if(confirm("Annuler cette réservation ?")) cancelMutation.mutate(r.id); }}
                                                                        disabled={cancelMutation.isPending}
                                                                        className="text-[10px] font-bold text-destructive hover:underline disabled:opacity-50"
                                                                    >
                                                                        {cancelMutation.isPending ? "..." : "Annuler"}
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                                {reservations.length === 0 && (
                                                    <tr>
                                                        <td colSpan={7} className="py-8 text-center text-muted-foreground">Aucune réservation trouvée.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>
                            )}

                            {/* PROFILE */}
                            {activeTab === "profile" && (
                                <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                                    <h1 className="text-display text-3xl text-foreground mb-6">MON PROFIL</h1>
                                    <form onSubmit={handleProfileUpdate} className="glass p-6 space-y-4 max-w-lg">
                                        <div>
                                            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Prénom</label>
                                            <input value={firstName} onChange={e => setFirstName(e.target.value)} required className="w-full bg-muted rounded-lg px-4 py-2.5 text-foreground text-sm outline-none focus:ring-2 focus:ring-primary" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Nom</label>
                                            <input value={lastName} onChange={e => setLastName(e.target.value)} required className="w-full bg-muted rounded-lg px-4 py-2.5 text-foreground text-sm outline-none focus:ring-2 focus:ring-primary" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Email</label>
                                            <input defaultValue={user?.email!} disabled className="w-full bg-muted/50 opacity-70 rounded-lg px-4 py-2.5 text-foreground text-sm cursor-not-allowed" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Téléphone</label>
                                            <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-muted rounded-lg px-4 py-2.5 text-foreground text-sm outline-none focus:ring-2 focus:ring-primary" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Membre depuis</label>
                                            <p className="text-sm text-foreground font-mono">{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
                                        </div>
                                        <button disabled={isUpdating} type="submit" className="btn-neon mt-4 w-full disabled:opacity-50">
                                            {isUpdating ? "Sauvegarde..." : "Sauvegarder les modifications"}
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </div>
    );
}
