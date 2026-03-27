import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Search, MapPin, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";

export default function StadiumsManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingStadium, setEditingStadium] = useState<any>(null);
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        name: "",
        city: "",
        capacity: "",
        imageUrl: "",
        description: "",
        locationUrl: ""
    });

    const { data: stadiumsResponse, isLoading } = useQuery({
        queryKey: ["stadiums"],
        queryFn: async () => {
            const res = await api.get("/stadiums");
            return res.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: async (payload: any) => {
            const res = await api.post("/admin/stadiums", payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["stadiums"] });
            toast.success("Stade ajouté !");
            setIsDialogOpen(false);
            resetForm();
        },
        onError: (err: any) => toast.error(err.response?.data?.message || "Erreur lors de la création")
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, payload }: { id: number, payload: any }) => {
            const res = await api.put(`/admin/stadiums/${id}`, payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["stadiums"] });
            toast.success("Stade mis à jour !");
            setIsDialogOpen(false);
            resetForm();
        },
        onError: (err: any) => toast.error(err.response?.data?.message || "Erreur lors de la mise à jour")
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/admin/stadiums/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["stadiums"] });
            toast.success("Stade supprimé !");
        },
        onError: () => toast.error("Erreur, impossible de supprimer")
    });

    const resetForm = () => {
        setFormData({ name: "", city: "", capacity: "", imageUrl: "", description: "", locationUrl: "" });
        setEditingStadium(null);
    };

    const handleEdit = (stadium: any) => {
        setEditingStadium(stadium);
        setFormData({
            name: stadium.name,
            city: stadium.city,
            capacity: stadium.capacity.toString(),
            imageUrl: stadium.imageUrl || "",
            description: stadium.description || "",
            locationUrl: stadium.locationUrl || ""
        });
        setIsDialogOpen(true);
    };

    if (isLoading) return <div className="flex justify-center pt-24"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    const stadiums = stadiumsResponse?.data || [];
    const filteredStadiums = stadiums.filter((s: any) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            name: formData.name,
            city: formData.city,
            capacity: Number(formData.capacity),
            imageUrl: formData.imageUrl || null,
            description: formData.description || null,
            locationUrl: formData.locationUrl || null
        };

        if (editingStadium) {
            updateMutation.mutate({ id: editingStadium.id, payload });
        } else {
            createMutation.mutate(payload);
        }
    };

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-display text-4xl text-foreground">GESTION DES STADES</h1>
                    <p className="text-muted-foreground font-heading">Gérez les {stadiums.length} infrastructures sportives.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
                    <DialogTrigger asChild>
                        <button onClick={resetForm} className="btn-neon flex items-center gap-2 text-sm">
                            <Plus className="w-4 h-4" /> Ajouter un stade
                        </button>
                    </DialogTrigger>
                    <DialogContent className="glass-strong border-border/50 text-foreground max-w-md max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-display">{editingStadium ? "Modifier le Stade" : "Ajouter un Stade"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Nom du Stade *</label>
                                <input
                                    type="text" required value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Ex: Grand Stade de Tanger"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Ville *</label>
                                    <input
                                        type="text" required value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Ex: Tanger"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Capacité *</label>
                                    <input
                                        type="number" required min="1" value={formData.capacity}
                                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                        className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Ex: 65000"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Description *</label>
                                <textarea
                                    required rows={3} value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary resize-none"
                                    placeholder="Brève description du stade..."
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">URL de l'image *</label>
                                <input
                                    type="url" required value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="https://..."
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Embed Google Maps (src URL) *</label>
                                <input
                                    type="url" required value={formData.locationUrl}
                                    onChange={(e) => setFormData({ ...formData, locationUrl: e.target.value })}
                                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="https://www.google.com/maps/embed?..."
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsDialogOpen(false)} className="flex-1 py-2 rounded-lg bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors">
                                    Annuler
                                </button>
                                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(0,166,81,0.5)] disabled:opacity-50">
                                    {createMutation.isPending || updateMutation.isPending ? "Traitement..." : editingStadium ? "Mettre à jour" : "Ajouter le stade"}
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
                        type="text" placeholder="Rechercher un stade ou une ville..."
                        className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-border">
                            <TableHead>Nom du Stade</TableHead>
                            <TableHead>Ville</TableHead>
                            <TableHead>Capacité</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredStadiums.map((stadium: any) => (
                            <TableRow key={stadium.id} className="border-border/50 hover:bg-primary/5 transition-colors">
                                <TableCell className="font-heading font-semibold text-foreground flex items-center gap-3">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    {stadium.name}
                                </TableCell>
                                <TableCell className="text-muted-foreground">{stadium.city}</TableCell>
                                <TableCell className="font-mono text-sm">{stadium.capacity.toLocaleString()} places</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <button 
                                          onClick={() => handleEdit(stadium)}
                                          className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => { if (confirm("Supprimer ce stade ?")) deleteMutation.mutate(stadium.id) }} disabled={deleteMutation.isPending} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors disabled:opacity-50">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
