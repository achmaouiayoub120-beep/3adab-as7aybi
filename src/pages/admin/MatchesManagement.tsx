import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Calendar, Clock, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}

export default function MatchesManagement() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingMatch, setEditingMatch] = useState<any>(null);
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        homeTeamId: "",
        awayTeamId: "",
        stadiumId: "",
        date: "",
        priceVip: "",
        priceTribune: "",
        pricePopulaire: "",
        status: "SCHEDULED"
    });

    const { data: matchesResponse, isLoading: isLoadingMatches } = useQuery({
        queryKey: ["matches"],
        queryFn: async () => {
            const res = await api.get("/matches");
            return res.data;
        },
    });

    const { data: teamsResponse } = useQuery({
        queryKey: ["teams"],
        queryFn: async () => {
            const res = await api.get("/teams");
            return res.data;
        },
    });

    const { data: stadiumsResponse } = useQuery({
        queryKey: ["stadiums"],
        queryFn: async () => {
            const res = await api.get("/stadiums");
            return res.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: async (payload: any) => {
            const res = await api.post("/admin/matches", payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["matches"] });
            toast.success("Match créé avec succès !");
            setIsDialogOpen(false);
            resetForm();
        },
        onError: (err: any) => toast.error(err.response?.data?.message || "Erreur lors de la création")
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, payload }: { id: number, payload: any }) => {
            const res = await api.put(`/admin/matches/${id}`, payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["matches"] });
            toast.success("Match mis à jour !");
            setIsDialogOpen(false);
            resetForm();
        },
        onError: (err: any) => toast.error(err.response?.data?.message || "Erreur lors de la mise à jour")
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/admin/matches/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["matches"] });
            toast.success("Match supprimé !");
        },
        onError: () => toast.error("Erreur lors de la suppression")
    });

    const resetForm = () => {
        setFormData({
            homeTeamId: "", awayTeamId: "", stadiumId: "", date: "",
            priceVip: "", priceTribune: "", pricePopulaire: "", status: "SCHEDULED"
        });
        setEditingMatch(null);
    };

    const handleEdit = (match: any) => {
        setEditingMatch(match);
        // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
        const d = new Date(match.date);
        const localizedDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        
        setFormData({
            homeTeamId: match.homeTeamId.toString(),
            awayTeamId: match.awayTeamId.toString(),
            stadiumId: match.stadiumId.toString(),
            date: localizedDate,
            priceVip: match.priceVip.toString(),
            priceTribune: match.priceTribune.toString(),
            pricePopulaire: match.pricePopulaire.toString(),
            status: match.status
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.homeTeamId === formData.awayTeamId) {
            toast.error("L'équipe à domicile et à l'extérieur doivent être différentes.");
            return;
        }

        const stadium = stadiums.find((s: any) => s.id === Number(formData.stadiumId));
        const payload = {
            homeTeamId: Number(formData.homeTeamId),
            awayTeamId: Number(formData.awayTeamId),
            stadiumId: Number(formData.stadiumId),
            date: new Date(formData.date).toISOString(),
            matchday: 1, 
            priceVip: Number(formData.priceVip),
            priceTribune: Number(formData.priceTribune),
            pricePopulaire: Number(formData.pricePopulaire),
            seatsTotal: stadium?.capacity || 0,
            status: formData.status
        };

        if (editingMatch) {
            updateMutation.mutate({ id: editingMatch.id, payload });
        } else {
            createMutation.mutate({ ...payload, seatsAvailable: stadium?.capacity || 0 });
        }
    };

    if (isLoadingMatches) return <div className="flex justify-center pt-24"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    const matches = matchesResponse?.data || [];
    const teams = teamsResponse?.data || [];
    const stadiums = stadiumsResponse?.data || [];

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-display text-4xl text-foreground">GESTION DES MATCHS</h1>
                    <p className="text-muted-foreground font-heading">Programmez et gérez les {matches.length} rencontres.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <button className="btn-neon flex items-center gap-2 text-sm">
                            <Plus className="w-4 h-4" /> Créer un match
                        </button>
                    </DialogTrigger>
                    <DialogContent className="glass-strong border-border/50 text-foreground max-w-lg max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-display">Créer un Match</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Équipe Domicile *</label>
                                    <select
                                        required
                                        value={formData.homeTeamId}
                                        onChange={(e) => {
                                            setFormData({ ...formData, homeTeamId: e.target.value });
                                            const team = teams.find((t: any) => t.id === Number(e.target.value));
                                            if (team && !formData.stadiumId) {
                                                setFormData(prev => ({ ...prev, stadiumId: team.stadiumId?.toString() }));
                                            }
                                        }}
                                        className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="">Sélectionner</option>
                                        {teams.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Équipe Extérieure *</label>
                                    <select
                                        required
                                        value={formData.awayTeamId}
                                        onChange={(e) => setFormData({ ...formData, awayTeamId: e.target.value })}
                                        className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="">Sélectionner</option>
                                        {teams.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Stade *</label>
                                <select
                                    required
                                    value={formData.stadiumId}
                                    onChange={(e) => setFormData({ ...formData, stadiumId: e.target.value })}
                                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">Sélectionner un stade</option>
                                    {stadiums.map((s: any) => <option key={s.id} value={s.id}>{s.name} ({s.city})</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Date & Heure *</label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Prix des Billets (MAD) *</label>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="text-[10px] text-muted-foreground mb-1 block text-center">VIP</label>
                                        <input
                                            type="number" required min="0" placeholder="0"
                                            value={formData.priceVip}
                                            onChange={(e) => setFormData({ ...formData, priceVip: e.target.value })}
                                            className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none text-center focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-muted-foreground mb-1 block text-center">TRIBUNE</label>
                                        <input
                                            type="number" required min="0" placeholder="0"
                                            value={formData.priceTribune}
                                            onChange={(e) => setFormData({ ...formData, priceTribune: e.target.value })}
                                            className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none text-center focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-muted-foreground mb-1 block text-center">POPULAIRE</label>
                                        <input
                                            type="number" required min="0" placeholder="0"
                                            value={formData.pricePopulaire}
                                            onChange={(e) => setFormData({ ...formData, pricePopulaire: e.target.value })}
                                            className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none text-center focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Statut *</label>
                                <select
                                    required
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="SCHEDULED">À venir (SCHEDULED)</option>
                                    <option value="LIVE">En direct (LIVE)</option>
                                    <option value="FINISHED">Terminé (FINISHED)</option>
                                    <option value="CANCELLED">Annulé (CANCELLED)</option>
                                </select>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsDialogOpen(false)} className="flex-1 py-2 rounded-lg bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors">
                                    Annuler
                                </button>
                                <button type="submit" disabled={createMutation.isPending} className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(0,166,81,0.5)] disabled:opacity-50">
                                    {createMutation.isPending ? "Création..." : "Programmer"}
                                </button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </header>

            <div className="glass-strong p-6">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-border">
                            <TableHead>Date & Heure</TableHead>
                            <TableHead>Match</TableHead>
                            <TableHead>Stade</TableHead>
                            <TableHead>Prix (V/T/P)</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {matches.map((match: any) => {
                            const date = new Date(match.date);
                            return (
                                <TableRow key={match.id} className="border-border/50 hover:bg-primary/5 transition-colors">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="flex items-center gap-1 text-sm font-semibold">
                                                <Calendar className="w-3 h-3 text-primary" />
                                                {date.toLocaleDateString("fr-FR", { day: '2-digit', month: '2-digit' })}
                                            </span>
                                            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                <Clock className="w-3 h-3" />
                                                {date.toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-heading font-bold text-sm">
                                        {match.homeTeam.shortName} vs {match.awayTeam.shortName}
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">{match.stadium.name}</TableCell>
                                    <TableCell className="font-mono text-xs">
                                        {match.priceVip}/{match.priceTribune}/{match.pricePopulaire}
                                    </TableCell>
                                    <TableCell>
                                        <span className={cn(
                                            "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider",
                                            match.status === "SCHEDULED" ? "bg-primary/10 text-primary" :
                                                match.status === "LIVE" ? "bg-red-500/10 text-red-500 animate-pulse" :
                                                    "bg-muted text-muted-foreground"
                                        )}>
                                            {match.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    if(confirm("Supprimer ce match ?")) deleteMutation.mutate(match.id);
                                                }} 
                                                className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors disabled:opacity-50"
                                                disabled={deleteMutation.isPending}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
