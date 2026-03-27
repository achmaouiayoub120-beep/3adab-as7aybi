import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Shield, UserX, UserCheck, History, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}

export default function UsersManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const queryClient = useQueryClient();

    const { data: usersResponse, isLoading } = useQuery({
        queryKey: ["adminUsers"],
        queryFn: async () => {
            const res = await api.get("/admin/users");
            return res.data.data;
        },
    });

    const toggleStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            const res = await api.patch(`/admin/users/${id}/status`, { status });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
            toast.success("Statut de l'utilisateur mis à jour");
        },
        onError: () => toast.error("Erreur lors de la mise à jour du statut")
    });

    if (isLoading) return <div className="flex justify-center pt-24"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    const users = usersResponse || [];
    const filteredUsers = users.filter((u: any) =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-display text-4xl text-foreground">GESTION DES UTILISATEURS</h1>
                <p className="text-muted-foreground font-heading">Gérez les comptes et les permissions.</p>
            </header>

            <div className="glass-strong p-6">
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Rechercher un utilisateur (nom, email)..."
                        className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-border">
                            <TableHead>Utilisateur</TableHead>
                            <TableHead>Rôle</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Inscrit le</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map((user: any) => (
                            <TableRow key={user.id} className="border-border/50 text-sm">
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-heading font-bold text-foreground">{user.firstName} {user.lastName}</span>
                                        <span className="text-xs text-muted-foreground">{user.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className={cn(
                                        "flex items-center gap-1 w-fit px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                        user.role === "ADMIN" ? "bg-gold/10 text-gold" : "bg-muted text-muted-foreground"
                                    )}>
                                        {user.role === "ADMIN" && <Shield className="w-3 h-3" />}
                                        {user.role}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className={cn(
                                        "w-fit px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                        user.isActive ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                                    )}>
                                        {user.isActive ? "ACTIF" : "BLOQUÉ"}
                                    </span>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <button title="Historique" className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                                            <History className="w-4 h-4" />
                                        </button>
                                        {user.isActive ? (
                                            <button 
                                              onClick={() => toggleStatusMutation.mutate({ id: user.id, status: "BLOCKED" })}
                                              title="Bloquer" 
                                              className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                                            >
                                                <UserX className="w-4 h-4" />
                                            </button>
                                        ) : (
                                            <button 
                                              onClick={() => toggleStatusMutation.mutate({ id: user.id, status: "ACTIVE" })}
                                              title="Débloquer" className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                                            >
                                                <UserCheck className="w-4 h-4" />
                                            </button>
                                        )}
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
