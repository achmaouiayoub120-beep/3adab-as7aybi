import { prisma } from '../lib/prisma';
import { nanoid } from 'nanoid';

export const reservationService = {
  async create(data: { userId: string; matchId: number; zone: string; quantity: number; paymentMethod?: string }) {
    const match = await prisma.match.findUnique({ where: { id: data.matchId } });
    if (!match) throw Object.assign(new Error('Match introuvable.'), { statusCode: 404 });
    if (match.status !== 'SCHEDULED') throw Object.assign(new Error('Ce match n\'est plus disponible.'), { statusCode: 400 });
    if (match.seatsAvailable < data.quantity) throw Object.assign(new Error('Places insuffisantes.'), { statusCode: 400 });

    const priceMap: Record<string, number> = { VIP: match.priceVip, TRIBUNE: match.priceTribune, POPULAIRE: match.pricePopulaire };
    const unitPrice = priceMap[data.zone];
    if (!unitPrice) throw Object.assign(new Error('Zone invalide.'), { statusCode: 400 });
    const totalPrice = unitPrice * data.quantity;

    // Atomic transaction
    const result = await prisma.$transaction(async (tx) => {
      await tx.match.update({
        where: { id: data.matchId },
        data: { seatsAvailable: { decrement: data.quantity } },
      });

      const reservation = await tx.reservation.create({
        data: {
          userId: data.userId, matchId: data.matchId,
          zone: data.zone, quantity: data.quantity,
          totalPrice, paymentMethod: data.paymentMethod || 'card',
          status: 'CONFIRMED', paidAt: new Date(),
        },
        include: { match: { include: { homeTeam: true, awayTeam: true, stadium: true } }, user: { select: { id: true, firstName: true, lastName: true, email: true } } },
      });

      // Generate individual tickets
      const tickets = await Promise.all(
        Array.from({ length: data.quantity }).map(async (_, i) => {
          const code = `BTK-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}-${String(i + 1).padStart(3, '0')}`;
          const qrData = JSON.stringify({
            code, matchId: data.matchId,
            zone: data.zone, reservationId: reservation.id,
            timestamp: Date.now(), nonce: nanoid(8),
          });
          return tx.ticket.create({
            data: { ticketCode: code, reservationId: reservation.id, zone: data.zone, qrData },
          });
        })
      );

      return { reservation, tickets };
    });

    return result;
  },

  async getUserReservations(userId: string) {
    return prisma.reservation.findMany({
      where: { userId },
      include: {
        match: { include: { homeTeam: true, awayTeam: true, stadium: true } },
        tickets: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getById(reservationId: string, userId?: string) {
    const where: any = { id: reservationId };
    if (userId) where.userId = userId;
    return prisma.reservation.findFirst({
      where,
      include: {
        match: { include: { homeTeam: true, awayTeam: true, stadium: true } },
        tickets: true,
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
  },

  async cancel(reservationId: string, userId: string) {
    const reservation = await prisma.reservation.findFirst({
      where: { id: reservationId, userId, status: 'CONFIRMED' },
    });
    if (!reservation) throw Object.assign(new Error('Réservation introuvable ou déjà annulée.'), { statusCode: 404 });

    return prisma.$transaction(async (tx) => {
      await tx.match.update({
        where: { id: reservation.matchId },
        data: { seatsAvailable: { increment: reservation.quantity } },
      });
      return tx.reservation.update({
        where: { id: reservationId },
        data: { status: 'CANCELLED' },
        include: { match: { include: { homeTeam: true, awayTeam: true, stadium: true } }, tickets: true },
      });
    });
  },
};
