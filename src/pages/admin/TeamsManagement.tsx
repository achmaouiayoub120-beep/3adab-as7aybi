import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Search, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";

export default function TeamsManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        name: "",
        shortName: "",
        city: "",
        color1: "#00A651",
        color2: "#FFFFFF",
        stadiumId: "",
        logo: ""
    });

    const { data: teamsResponse, isLoading: isLoadingTeams } = useQuery({
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
            const res = await api.post("/admin/teams", payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teams"] });
            toast.success("Équipe ajoutée !");
            setIsDialogOpen(false);
            setFormData({ name: "", shortName: "", city: "", color1: "#00A651", color2: "#FFFFFF", stadiumId: "", logo: "" });
        },
        onError: (err: any) => toast.error(err.response?.data?.message || "Erreur lors de la création")
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/admin/teams/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teams"] });
            toast.success("Équipe supprimée !");
        },
        onError: () => toast.error("Erreur, impossible de supprimer")
    });

    if (isLoadingTeams) return <div className="flex justify-center pt-24"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    const teams = teamsResponse?.data || [];
    const stadiums = stadiumsResponse?.data || [];

    const filteredTeams = teams.filter((team: any) =>
        team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate({
            name: formData.name,
            shortName: formData.shortName.toUpperCase(),
            city: formData.city,
            color1: formData.color1,
            color2: formData.color2,
            stadiumId: Number(formData.stadiumId),
            logo: formData.logo || undefined
        });
    };

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-display text-4xl text-foreground">GESTION DES ÉQUIPES</h1>
                    <p className="text-muted-foreground font-heading">Gérez les {teams.length} clubs de la Botola Pro.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <button className="btn-neon flex items-center gap-2 text-sm">
                            <Plus className="w-4 h-4" /> Ajouter une équipe
                        </button>
                    </DialogTrigger>
                    <DialogContent className="glass-strong border-border/50 text-foreground max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-display">Ajouter une Équipe</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Nom Complet *</label>
                                <input
                                    type="text" required value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Ex: Raja Club Athletic"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Sigle (Court) *</label>
                                    <input
                                        type="text" required maxLength={5} value={formData.shortName}
                                        onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                                        className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary uppercase"
                                        placeholder="Ex: RCA"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Ville *</label>
                                    <input
                                        type="text" required value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Ex: Casablanca"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Stade Principal *</label>
                                <select
                                    required value={formData.stadiumId}
                                    onChange={(e) => setFormData({ ...formData, stadiumId: e.target.value })}
                                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">Sélectionner un stade</option>
                                    {stadiums.map((s: any) => <option key={s.id} value={s.id}>{s.name} ({s.city})</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">URL du Logo (Optionnel)</label>
                                <input
                                    type="url" value={formData.logo}
                                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Couleur 1 (Primaire)</label>
                                    <input
                                        type="color" required value={formData.color1}
                                        onChange={(e) => setFormData({ ...formData, color1: e.target.value })}
                                        className="w-full h-10 bg-muted border border-border rounded-lg px-2 py-1 cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Couleur 2 (Secondaire)</label>
                                    <input
                                        type="color" required value={formData.color2}
                                        onChange={(e) => setFormData({ ...formData, color2: e.target.value })}
                                        className="w-full h-10 bg-muted border border-border rounded-lg px-2 py-1 cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsDialogOpen(false)} className="flex-1 py-2 rounded-lg bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors">
                                    Annuler
                                </button>
                                <button type="submit" disabled={createMutation.isPending} className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(0,166,81,0.5)] disabled:opacity-50">
                                    {createMutation.isPending ? "Création..." : "Ajouter l'équipe"}
                                </button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </header>

            <div className="glass-strong p-6">
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text" placeholder="Rechercher une équipe ou une ville..."
                        className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-border">
                            <TableHead className="w-[80px]">Logo</TableHead>
                            <TableHead>Nom du Club</TableHead>
                            <TableHead>Ville</TableHead>
                            <TableHead>Couleurs</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTeams.map((team: any) => {
                            return (
                                <TableRow key={team.id} className="border-border/50 hover:bg-primary/5 transition-colors">
                                    <TableCell>
                                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden border border-border/50 bg-white">
                                            {team.logoUrl ? (
                                                <img src={team.logoUrl} alt={team.name} className="w-full h-full object-contain p-1" />
                                            ) : (
                                                <span className="text-xs font-bold text-muted-foreground">{team.shortName}</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-heading font-semibold text-foreground">{team.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{team.city}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            {team.color1 && <div className="w-4 h-4 rounded-full border border-border shadow-sm" style={{ background: team.color1 }} />}
                                            {team.color2 && <div className="w-4 h-4 rounded-full border border-border shadow-sm" style={{ background: team.color2 }} />}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => { if (confirm("Supprimer cette équipe ?")) deleteMutation.mutate(team.id) }} disabled={deleteMutation.isPending} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors disabled:opacity-50">
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
