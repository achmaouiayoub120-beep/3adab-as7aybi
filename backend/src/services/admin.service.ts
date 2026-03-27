import { prisma } from '../lib/prisma';

export const adminService = {
  async getStats() {
    const [totalUsers, totalMatches, totalReservations, totalTickets, confirmedReservations, usedTickets] = await Promise.all([
      prisma.user.count(),
      prisma.match.count(),
      prisma.reservation.count(),
      prisma.ticket.count(),
      prisma.reservation.count({ where: { status: 'CONFIRMED' } }),
      prisma.ticket.count({ where: { isUsed: true } }),
    ]);

    const revenueResult = await prisma.reservation.aggregate({
      _sum: { totalPrice: true },
      where: { status: 'CONFIRMED' },
    });

    const scheduledMatches = await prisma.match.count({ where: { status: 'SCHEDULED' } });

    return {
      totalUsers,
      totalMatches,
      scheduledMatches,
      totalReservations,
      confirmedReservations,
      totalTickets,
      usedTickets,
      revenue: revenueResult._sum.totalPrice || 0,
    };
  },

  async getUsers() {
    return prisma.user.findMany({
      select: {
        id: true, email: true, firstName: true, lastName: true,
        phone: true, role: true, isActive: true, createdAt: true,
        _count: { select: { reservations: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async toggleUserActive(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw Object.assign(new Error('Utilisateur introuvable.'), { statusCode: 404 });
    return prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
      select: { id: true, email: true, firstName: true, lastName: true, isActive: true, role: true },
    });
  },

  async getAllReservations() {
    return prisma.reservation.findMany({
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        match: { include: { homeTeam: true, awayTeam: true, stadium: true } },
        tickets: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async validateTicket(ticketCode: string) {
    const ticket = await prisma.ticket.findUnique({
      where: { ticketCode },
      include: {
        reservation: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, email: true } },
            match: { include: { homeTeam: true, awayTeam: true, stadium: true } },
          },
        },
      },
    });

    if (!ticket) throw Object.assign(new Error('Billet introuvable.'), { statusCode: 404 });
    if (ticket.isUsed) return { ticket, alreadyUsed: true, usedAt: ticket.usedAt };

    const updated = await prisma.ticket.update({
      where: { id: ticket.id },
      data: { isUsed: true, usedAt: new Date() },
      include: {
        reservation: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, email: true } },
            match: { include: { homeTeam: true, awayTeam: true, stadium: true } },
          },
        },
      },
    });

    return { ticket: updated, alreadyUsed: false };
  },

  // CRUD Teams
  async createTeam(data: any) {
    return prisma.team.create({ data, include: { stadium: true } });
  },
  async updateTeam(id: number, data: any) {
    return prisma.team.update({ where: { id }, data, include: { stadium: true } });
  },
  async deleteTeam(id: number) {
    return prisma.team.delete({ where: { id } });
  },

  // CRUD Stadiums
  async createStadium(data: any) {
    return prisma.stadium.create({ data });
  },
  async updateStadium(id: number, data: any) {
    return prisma.stadium.update({ where: { id }, data });
  },
  async deleteStadium(id: number) {
    return prisma.stadium.delete({ where: { id } });
  },

  // CRUD Matches
  async createMatch(data: any) {
    return prisma.match.create({
      data: { ...data, seatsAvailable: data.seatsTotal },
      include: { homeTeam: true, awayTeam: true, stadium: true },
    });
  },
  async updateMatch(id: number, data: any) {
    return prisma.match.update({ where: { id }, data, include: { homeTeam: true, awayTeam: true, stadium: true } });
  },
  async deleteMatch(id: number) {
    return prisma.match.delete({ where: { id } });
  },

  async getAnalytics() {
    const stats = await this.getStats();

    const reservationsByZone = await prisma.reservation.groupBy({
      by: ['zone'],
      _count: { id: true },
      _sum: { totalPrice: true },
      where: { status: 'CONFIRMED' },
    });

    const recentReservationsRaw = await prisma.reservation.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { firstName: true, lastName: true } },
        match: { include: { homeTeam: true, awayTeam: true } },
      },
    });

    const matchRevenue = await prisma.reservation.groupBy({
      by: ['matchId'],
      _sum: { totalPrice: true },
      _count: { id: true },
      where: { status: 'CONFIRMED' },
      orderBy: { _sum: { totalPrice: 'desc' } },
      take: 5,
    });

    const topMatchIds = matchRevenue.map(m => m.matchId);
    const topMatchesRaw = await prisma.match.findMany({
      where: { id: { in: topMatchIds } },
      include: { homeTeam: true, awayTeam: true },
    });

    const topMatchesWithRevenue = matchRevenue.map(mr => {
      const match = topMatchesRaw.find(m => m.id === mr.matchId);
      return {
        matchId: mr.matchId,
        match: match ? `${match.homeTeam.shortName} vs ${match.awayTeam.shortName}` : 'N/A',
        revenue: mr._sum.totalPrice || 0,
        tickets: mr._count.id,
      };
    });

    const zoneColors: Record<string, string> = { "VIP": "hsl(43 90% 48%)", "Tribune": "hsl(152 100% 32%)", "Populaire": "hsl(213 76% 51%)" };
    const zoneData = reservationsByZone.map(z => ({
      name: z.zone,
      value: z._count.id,
      color: zoneColors[z.zone] || "hsl(220 10% 46%)"
    }));

    const recentReservations = recentReservationsRaw.map(r => ({
      id: r.id.toString(),
      user: `${r.user.firstName} ${r.user.lastName}`,
      match: `${r.match.homeTeam.shortName} vs ${r.match.awayTeam.shortName}`,
      zone: r.zone,
      amount: r.totalPrice,
      status: r.status,
      date: r.createdAt.toISOString().split('T')[0]
    }));

    return {
      usersCount: stats.totalUsers,
      usersChange: "+12%",
      ticketsSold: stats.usedTickets,
      ticketsChange: "+5%",
      revenue: stats.revenue,
      revenueChange: "+8%",
      activeMatches: stats.scheduledMatches,
      salesData: [
        { name: "Lun", sales: 120 }, { name: "Mar", sales: 250 },
        { name: "Mer", sales: 180 }, { name: "Jeu", sales: 300 },
        { name: "Ven", sales: 450 }, { name: "Sam", sales: 800 }, { name: "Dim", sales: 650 }
      ],
      zoneData: zoneData.length > 0 ? zoneData : [{ name: "VIP", value: 1, color: "hsl(43 90% 48%)" }],
      topMatches: topMatchesWithRevenue,
      recentReservations,
      alerts: [
        { type: "info", text: `${stats.scheduledMatches} matchs sont actuellement ouverts à la billetterie.` },
        { type: "warning", text: "Vérifiez les quotas pour le prochain derby." }
      ]
    };
  },
};
