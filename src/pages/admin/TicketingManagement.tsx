import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, QrCode, CheckCircle2, Loader2, ScanLine, Ticket as TicketIcon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}

export default function TicketingManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [scannerOpen, setScannerOpen] = useState(false);
    const [scannedCode, setScannedCode] = useState("");
    const queryClient = useQueryClient();

    const { data: ticketsResponse, isLoading } = useQuery({
        queryKey: ["admin-tickets"],
        queryFn: async () => {
            const res = await api.get("/admin/tickets");
            return res.data;
        },
    });

    const validateMutation = useMutation({
        mutationFn: async (code: string) => {
            const res = await api.post(`/admin/tickets/validate/${code}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-tickets"] });
            toast.success("Billet validé avec succès");
            setScannerOpen(false);
            setScannedCode("");
        },
        onError: (err: any) => toast.error(err.response?.data?.message || "Code invalide ou déjà utilisé")
    });

    if (isLoading) return <div className="flex justify-center pt-24"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    const tickets = ticketsResponse?.data || [];
    const filteredTickets = tickets.filter((t: any) =>
        t.ticketCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.reservation?.user?.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleScan = (e: React.FormEvent) => {
        e.preventDefault();
        if (scannedCode) validateMutation.mutate(scannedCode);
    };

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-display text-4xl text-foreground">BILLETTERIE & VALIDATION</h1>
                    <p className="text-muted-foreground font-heading">Contrôlez les accès et gérez les {tickets.length} billets émis.</p>
                </div>

                <Dialog open={scannerOpen} onOpenChange={setScannerOpen}>
                    <DialogTrigger asChild>
                        <button className="btn-neon flex items-center gap-2">
                            <ScanLine className="w-5 h-5" /> Scanner un billet
                        </button>
                    </DialogTrigger>
                    <DialogContent className="glass-strong border-border/50 text-foreground">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-display uppercase">Validation Manuelle</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleScan} className="space-y-4 mt-4">
                            <div className="p-4 bg-muted/50 rounded-xl border border-dashed border-border flex flex-col items-center gap-4">
                                <QrCode className="w-16 h-16 text-primary opacity-50" />
                                <input
                                    type="text"
                                    placeholder="Entrez le code du billet..."
                                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-center font-mono text-lg outline-none focus:ring-2 focus:ring-primary"
                                    value={scannedCode}
                                    onChange={(e) => setScannedCode(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={validateMutation.isPending || !scannedCode}
                                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(0,166,81,0.4)] disabled:opacity-50"
                            >
                                {validateMutation.isPending ? "Validation..." : "Valider le billet"}
                            </button>
                        </form>
                    </DialogContent>
                </Dialog>
            </header>

            <div className="glass-strong p-6">
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Rechercher par code ou email..."
                        className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="rounded-xl border border-border overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted/50 border-border">
                                <TableHead>Ticket ID</TableHead>
                                <TableHead>Match</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Zone</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTickets.map((ticket: any) => (
                                <TableRow key={ticket.id} className="border-border/50 hover:bg-primary/5 transition-colors text-sm">
                                    <TableCell className="font-mono text-xs font-bold text-primary">{ticket.ticketCode}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-foreground">
                                                {ticket.reservation?.match?.homeTeam?.shortName} vs {ticket.reservation?.match?.awayTeam?.shortName}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground">{ticket.reservation?.match?.stadium?.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-foreground">{ticket.reservation?.user?.firstName} {ticket.reservation?.user?.lastName}</span>
                                            <span className="text-[10px] text-muted-foreground">{ticket.reservation?.user?.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-muted border border-border text-muted-foreground uppercase">
                                            {ticket.zone}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-[10px] font-mono text-muted-foreground">
                                        {new Date(ticket.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {ticket.isUsed ? (
                                                <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                                                    <CheckCircle2 className="w-3 h-3" /> Utilisé
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-gold/10 text-gold text-[10px] font-bold uppercase tracking-wider border border-gold/20">
                                                    <TicketIcon className="w-3 h-3" /> Actif
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {!ticket.isUsed && (
                                            <button
                                                onClick={() => { if (confirm("Valider ce billet manuellement ?")) validateMutation.mutate(ticket.ticketCode); }}
                                                className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                                                title="Valider maintenant"
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
