import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ──────────── USERS ────────────
  const adminPass = await bcrypt.hash('Admin2026!', 12);
  const userPass = await bcrypt.hash('User2026!', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@botola.ma' },
    update: {},
    create: {
      email: 'admin@botola.ma',
      password: adminPass,
      firstName: 'Admin',
      lastName: 'Botola',
      phone: '+212600000001',
      role: 'ADMIN',
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@botola.ma' },
    update: {},
    create: {
      email: 'user@botola.ma',
      password: userPass,
      firstName: 'Yassine',
      lastName: 'El Moroccan',
      phone: '+212600000002',
      role: 'USER',
    },
  });

  console.log(`✅ Users: admin=${admin.email}, user=${user.email}`);

  // ──────────── STADIUMS ────────────
  const stadiums = await Promise.all([
    prisma.stadium.upsert({
      where: { id: 1 }, update: {}, create: {
        id: 1, name: 'Complexe Sportif Mohammed V', city: 'Casablanca', capacity: 67000,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Stade_Mohammed_V_1.jpg/280px-Stade_Mohammed_V_1.jpg',
        description: 'Le plus grand stade de Casablanca, domicile du Raja et du Wydad.',
        locationUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.8!2d-7.6328!3d33.5731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDM0JzIzLjIiTiA3wrAzNycyOC4wIlc!5e0!3m2!1sfr!2sma!4v1',
      },
    }),
    prisma.stadium.upsert({
      where: { id: 2 }, update: {}, create: {
        id: 2, name: 'Stade Prince Moulay Abdallah', city: 'Rabat', capacity: 53000,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Stade_Moulay_Abdellah.jpg/280px-Stade_Moulay_Abdellah.jpg',
        description: 'Stade national du Maroc, situé à Rabat.',
        locationUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.0!2d-6.8498!3d33.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0!2s0x0!5e0!3m2!1sfr!2sma!4v1',
      },
    }),
    prisma.stadium.upsert({
      where: { id: 3 }, update: {}, create: {
        id: 3, name: 'Stade de Fès', city: 'Fès', capacity: 45000,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Stade_de_F%C3%A8s.jpg/280px-Stade_de_F%C3%A8s.jpg',
        description: 'Principal stade de la ville de Fès.',
        locationUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3300.0!2d-5.0!3d34.03!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0!2s0x0!5e0!3m2!1sfr!2sma!4v1',
      },
    }),
    prisma.stadium.upsert({
      where: { id: 4 }, update: {}, create: {
        id: 4, name: 'Grand Stade de Tanger', city: 'Tanger', capacity: 65000,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Grand_stade_de_Tanger.jpg/280px-Grand_stade_de_Tanger.jpg',
        description: 'L\'un des plus grands stades du Maroc, situé à Tanger.',
        locationUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.0!2d-5.8!3d35.74!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0!2s0x0!5e0!3m2!1sfr!2sma!4v1',
      },
    }),
    prisma.stadium.upsert({
      where: { id: 5 }, update: {}, create: {
        id: 5, name: 'Stade de Marrakech', city: 'Marrakech', capacity: 45000,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Grand_Stade_de_Marrakech.jpg/280px-Grand_Stade_de_Marrakech.jpg',
        description: 'Grand stade de Marrakech.',
        locationUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3400.0!2d-8.0!3d31.63!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0!2s0x0!5e0!3m2!1sfr!2sma!4v1',
      },
    }),
    prisma.stadium.upsert({
      where: { id: 6 }, update: {}, create: {
        id: 6, name: 'Stade Adrar', city: 'Agadir', capacity: 45480,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Stade_Adrar_Agadir.jpg/280px-Stade_Adrar_Agadir.jpg',
        description: 'Stade principal d\'Agadir.',
        locationUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3445.0!2d-9.56!3d30.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0!2s0x0!5e0!3m2!1sfr!2sma!4v1',
      },
    }),
    prisma.stadium.upsert({
      where: { id: 7 }, update: {}, create: {
        id: 7, name: 'Stade Saniat Rmel', city: 'Tétouan', capacity: 33000,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Stade_Saniat_Rmel.jpg/280px-Stade_Saniat_Rmel.jpg',
        description: 'Stade de Tétouan.',
        locationUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3260.0!2d-5.37!3d35.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0!2s0x0!5e0!3m2!1sfr!2sma!4v1',
      },
    }),
    prisma.stadium.upsert({
      where: { id: 8 }, update: {}, create: {
        id: 8, name: 'Stade Municipal de Berkane', city: 'Berkane', capacity: 15000,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Stade_de_Berkane.jpg/280px-Stade_de_Berkane.jpg',
        description: 'Stade principal de Berkane.',
        locationUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3280.0!2d-2.32!3d34.92!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0!2s0x0!5e0!3m2!1sfr!2sma!4v1',
      },
    }),
  ]);

  console.log(`✅ Stadiums: ${stadiums.length} created`);

  // ──────────── TEAMS ────────────
  const teams = await Promise.all([
    prisma.team.upsert({ where: { shortName: 'RCA' }, update: {}, create: { id: 1, name: 'Raja Club Athletic', shortName: 'RCA', city: 'Casablanca', color1: '#00A651', color2: '#FFFFFF', stadiumId: 1, logoUrl: '/teams/raja.png' } }),
    prisma.team.upsert({ where: { shortName: 'WAC' }, update: {}, create: { id: 2, name: 'Wydad Athletic Club', shortName: 'WAC', city: 'Casablanca', color1: '#E31E24', color2: '#FFFFFF', stadiumId: 1, logoUrl: '/teams/wydad.png' } }),
    prisma.team.upsert({ where: { shortName: 'FAR' }, update: {}, create: { id: 3, name: 'AS FAR', shortName: 'FAR', city: 'Rabat', color1: '#006400', color2: '#FFD700', stadiumId: 2, logoUrl: '/teams/far.png' } }),
    prisma.team.upsert({ where: { shortName: 'FUS' }, update: {}, create: { id: 4, name: 'FUS Rabat', shortName: 'FUS', city: 'Rabat', color1: '#1E90FF', color2: '#FFFFFF', stadiumId: 2, logoUrl: '/teams/fus.png' } }),
    prisma.team.upsert({ where: { shortName: 'MAS' }, update: {}, create: { id: 5, name: 'MAS Fès', shortName: 'MAS', city: 'Fès', color1: '#228B22', color2: '#FF0000', stadiumId: 3, logoUrl: '/teams/mas.png' } }),
    prisma.team.upsert({ where: { shortName: 'IRT' }, update: {}, create: { id: 6, name: 'Ittihad Tanger', shortName: 'IRT', city: 'Tanger', color1: '#333399', color2: '#FFD700', stadiumId: 4, logoUrl: '/teams/irt.png' } }),
    prisma.team.upsert({ where: { shortName: 'HUSA' }, update: {}, create: { id: 7, name: 'Hassania Agadir', shortName: 'HUSA', city: 'Agadir', color1: '#006400', color2: '#FFFFFF', stadiumId: 6, logoUrl: '/teams/husa.png' } }),
    prisma.team.upsert({ where: { shortName: 'RSB' }, update: {}, create: { id: 8, name: 'Renaissance Berkane', shortName: 'RSB', city: 'Berkane', color1: '#FF8C00', color2: '#000000', stadiumId: 8, logoUrl: '/teams/rsb.png' } }),
    prisma.team.upsert({ where: { shortName: 'UTS' }, update: {}, create: { id: 9, name: 'Union Touarga', shortName: 'UTS', city: 'Rabat', color1: '#0000CD', color2: '#FFFFFF', stadiumId: 2, logoUrl: '/teams/uts.png' } }),
    prisma.team.upsert({ where: { shortName: 'MAT' }, update: {}, create: { id: 10, name: 'Moghreb Tétouan', shortName: 'MAT', city: 'Tétouan', color1: '#FFFFFF', color2: '#006400', stadiumId: 7, logoUrl: '/teams/mat.png' } }),
    prisma.team.upsert({ where: { shortName: 'OCS' }, update: {}, create: { id: 11, name: 'Olympic Safi', shortName: 'OCS', city: 'Safi', color1: '#228B22', color2: '#FFFFFF', stadiumId: 5, logoUrl: '/teams/ocs.png' } }),
    prisma.team.upsert({ where: { shortName: 'DHJ' }, update: {}, create: { id: 12, name: 'Difaa El Jadidi', shortName: 'DHJ', city: 'El Jadida', color1: '#FFD700', color2: '#006400', stadiumId: 5, logoUrl: '/teams/dhj.png' } }),
    prisma.team.upsert({ where: { shortName: 'RCOZ' }, update: {}, create: { id: 13, name: 'RC Oued Zem', shortName: 'RCOZ', city: 'Oued Zem', color1: '#800080', color2: '#FFFFFF', stadiumId: 5, logoUrl: '/teams/rcoz.png' } }),
    prisma.team.upsert({ where: { shortName: 'SCCM' }, update: {}, create: { id: 14, name: 'SC Chabab Mohammedia', shortName: 'SCCM', city: 'Mohammedia', color1: '#FF0000', color2: '#000000', stadiumId: 1, logoUrl: '/teams/sccm.png' } }),
    prisma.team.upsert({ where: { shortName: 'JSS' }, update: {}, create: { id: 15, name: 'Jeunesse Sportive Soualem', shortName: 'JSS', city: 'Soualem', color1: '#006400', color2: '#FFD700', stadiumId: 1, logoUrl: '/teams/jss.png' } }),
    prisma.team.upsert({ where: { shortName: 'CODM' }, update: {}, create: { id: 16, name: 'COD Meknès', shortName: 'CODM', city: 'Meknès', color1: '#006400', color2: '#FFFFFF', stadiumId: 3, logoUrl: '/teams/codm.png' } }),
  ]);

  console.log(`✅ Teams: ${teams.length} created`);

  // ──────────── MATCHES ────────────
  const matchesData = [
    { homeTeamId: 1, awayTeamId: 2, stadiumId: 1, date: new Date('2026-04-05T19:00:00'), matchday: 26, priceVip: 400, priceTribune: 200, pricePopulaire: 80 },
    { homeTeamId: 3, awayTeamId: 5, stadiumId: 2, date: new Date('2026-04-06T17:00:00'), matchday: 26, priceVip: 350, priceTribune: 150, pricePopulaire: 60 },
    { homeTeamId: 6, awayTeamId: 4, stadiumId: 4, date: new Date('2026-04-06T19:00:00'), matchday: 26, priceVip: 300, priceTribune: 120, pricePopulaire: 50 },
    { homeTeamId: 9, awayTeamId: 2, stadiumId: 2, date: new Date('2026-04-12T19:00:00'), matchday: 27, priceVip: 350, priceTribune: 180, pricePopulaire: 70 },
    { homeTeamId: 8, awayTeamId: 12, stadiumId: 8, date: new Date('2026-04-13T17:00:00'), matchday: 27, priceVip: 200, priceTribune: 80, pricePopulaire: 40 },
    { homeTeamId: 7, awayTeamId: 10, stadiumId: 6, date: new Date('2026-04-13T19:00:00'), matchday: 27, priceVip: 250, priceTribune: 100, pricePopulaire: 50 },
    { homeTeamId: 2, awayTeamId: 1, stadiumId: 1, date: new Date('2026-04-19T21:00:00'), matchday: 28, priceVip: 500, priceTribune: 250, pricePopulaire: 100 },
    { homeTeamId: 5, awayTeamId: 3, stadiumId: 3, date: new Date('2026-04-20T17:00:00'), matchday: 28, priceVip: 300, priceTribune: 120, pricePopulaire: 50 },
    { homeTeamId: 11, awayTeamId: 16, stadiumId: 5, date: new Date('2026-04-20T19:00:00'), matchday: 28, priceVip: 200, priceTribune: 80, pricePopulaire: 40 },
    { homeTeamId: 13, awayTeamId: 14, stadiumId: 5, date: new Date('2026-04-26T17:00:00'), matchday: 29, priceVip: 150, priceTribune: 70, pricePopulaire: 30 },
  ];

  for (const m of matchesData) {
    const stadium = await prisma.stadium.findUnique({ where: { id: m.stadiumId } });
    const capacity = stadium?.capacity || 45000;
    const vipSeats = Math.floor(capacity * 0.15);
    const tribuneSeats = Math.floor(capacity * 0.45);
    const populaireSeats = capacity - vipSeats - tribuneSeats;

    await prisma.match.create({
      data: {
        ...m,
        seatsTotal: capacity,
        seatsVip: vipSeats,
        seatsTribune: tribuneSeats,
        seatsPopulaire: populaireSeats,
        seatsAvailable: capacity,
        status: 'SCHEDULED',
      },
    });
  }

  console.log(`✅ Matches: ${matchesData.length} created`);
  console.log('');
  console.log('╔══════════════════════════════════════════╗');
  console.log('║          🎉 SEED COMPLETE                ║');
  console.log('║                                          ║');
  console.log('║  Admin: admin@botola.ma / Admin2026!     ║');
  console.log('║  User:  user@botola.ma  / User2026!     ║');
  console.log('╚══════════════════════════════════════════╝');
}

main()
  .catch((e) => { console.error('❌ Seed error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
