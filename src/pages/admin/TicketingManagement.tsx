import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Download, QrCode, CheckCircle2, Loader2, RefreshCw } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}

export default function TicketingManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [codeToScan, setCodeToScan] = useState("");
    const queryClient = useQueryClient();

    const { data: ticketsResponse, isLoading } = useQuery({
        queryKey: ["adminTickets"],
        queryFn: async () => {
            const res = await api.get("/admin/tickets");
            return res.data.data;
        },
    });

    const validateMutation = useMutation({
        mutationFn: async (ticketCode: string) => {
            const res = await api.post("/admin/tickets/validate", { ticketCode });
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["adminTickets"] });
            toast.success(data.message || "Billet validé avec succès !");
            setCodeToScan("");
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Erreur lors de la validation du billet");
        }
    });

    if (isLoading) return <div className="flex justify-center pt-24"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    const tickets = ticketsResponse || [];
    const filtered = tickets.filter((t: any) =>
        t.ticketCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (`${t.user.firstName} ${t.user.lastName}`).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (`${t.match.homeTeam.shortName} vs ${t.match.awayTeam.shortName}`).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleManualValidation = () => {
        if (!codeToScan) return toast.error("Veuillez saisir un code à valider");
        validateMutation.mutate(codeToScan);
    };

    return (
        <div className="space-y-8">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-display text-4xl text-foreground">BILLETTERIE & RÉSERVATIONS</h1>
                    <p className="text-muted-foreground font-heading">Suivi des ventes et validation des billets.</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => queryClient.invalidateQueries({ queryKey: ["adminTickets"] })} className="btn-outline-neon flex items-center gap-2 text-sm px-3">
                        <RefreshCw className="w-4 h-4" />
                    </button>
                    <button className="btn-outline-neon flex items-center gap-2 text-sm">
                        <Download className="w-4 h-4" /> Exporter rapport
                    </button>
                </div>
            </header>

            {/* "Scanner Billet" section mock */}
            <div className="glass-strong p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div>
                    <h3 className="font-heading font-bold text-foreground">Validation Manuelle</h3>
                    <p className="text-xs text-muted-foreground">Entrez le code unique du billet pour le valider</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Code du billet..."
                            className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                            value={codeToScan}
                            onChange={(e) => setCodeToScan(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleManualValidation}
                        disabled={validateMutation.isPending}
                        className="btn-neon flex items-center gap-2 text-sm py-2"
                    >
                        {validateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Valider"}
                    </button>
                </div>
            </div>

            <div className="glass-strong p-6">
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Rechercher par ID billet, utilisateur ou match..."
                        className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-border">
                                <TableHead>ID Billet</TableHead>
                                <TableHead>Utilisateur</TableHead>
                                <TableHead>Match / Zone</TableHead>
                                <TableHead>Statut du Billet</TableHead>
                                <TableHead>Statut Réservation</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((ticket: any) => (
                                <TableRow key={ticket.id} className="border-border/50 text-sm">
                                    <TableCell className="font-mono font-bold text-primary">{ticket.ticketCode}</TableCell>
                                    <TableCell className="font-heading">{ticket.user.firstName} {ticket.user.lastName}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-foreground font-medium">{ticket.match.homeTeam.shortName} vs {ticket.match.awayTeam.shortName}</span>
                                            <span className="text-[10px] text-muted-foreground uppercase">{ticket.zone}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={cn(
                                            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                            ticket.status === "SCANNED" ? "bg-primary/10 text-primary" :
                                                ticket.status === "ACTIVE" ? "bg-accent/10 text-accent" :
                                                    "bg-destructive/10 text-destructive"
                                        )}>
                                            {ticket.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className={cn(
                                            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                            ticket.reservation.status === "CONFIRMED" ? "bg-primary/10 text-primary" : "bg-gold/10 text-gold"
                                        )}>
                                            {ticket.reservation.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {ticket.status === "ACTIVE" && ticket.reservation.status === "CONFIRMED" && (
                                                <button
                                                    onClick={() => validateMutation.mutate(ticket.ticketCode)}
                                                    title="Marquer comme scanné"
                                                    className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                                                >
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filtered.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Aucun billet trouvé.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
