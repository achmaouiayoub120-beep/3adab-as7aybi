export interface Stadium {
  id: number;
  name: string;
  city: string;
  capacity: number;
  image: string;
  description: string;
  location: string;
}

export const STADIUMS: Stadium[] = [
  {
    id: 1,
    name: "Stade Mohammed V",
    city: "Casablanca",
    capacity: 67000,
    image: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1000&auto=format&fit=crop",
    description: "Surnommé « Stade d'Honneur », ce complexe historique au cœur de Casablanca est le fief des deux géants du football marocain : le Wydad et le Raja. Une ambiance électrique garantie à chaque derby.",
    location: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.750567280951!2d-7.647313024505149!3d33.58580664219524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7d2de5afba143%3A0xcfd97ab25ee9fc8a!2sStade%20Mohammed%20V!5e0!3m2!1sfr!2sma!4v1714080000000!5m2!1sfr!2sma"
  },
  {
    id: 2,
    name: "Complexe Sportif Prince Moulay Abdellah",
    city: "Rabat",
    capacity: 52000,
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1000&auto=format&fit=crop",
    description: "L'antre de l'AS FAR et de l'équipe nationale marocaine. Réputé pour son architecture et ses installations de haut niveau, il a accueilli de nombreuses compétitions internationales.",
    location: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3308.234567280951!2d-6.892313024505149!3d33.95580664219524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zQ29tcGxleGUgU3BvcnRpZiBQcmluY2UgTW91bGF5IEFiZGVsbGFo!5e0!3m2!1sfr!2sma!4v1714080000000!5m2!1sfr!2sma"
  },
  {
    id: 3,
    name: "Grand Stade de Tanger",
    city: "Tanger",
    capacity: 65000,
    image: "https://images.unsplash.com/photo-1518605368461-1ee7e1620251?q=80&w=1000&auto=format&fit=crop",
    description: "Aussi appelé stade Ibn-Batouta. Ce joyau du Nord du Maroc accueille l'IR Tanger. Son architecture moderne et sa localisation en font l'un des plus beaux stades du royaume.",
    location: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3238.234567280951!2d-5.862313024505149!3d35.73580664219524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zR3JhbmQgU3RhZGUgZGUgVGFuZ2Vy!5e0!3m2!1sfr!2sma!4v1714080000000!5m2!1sfr!2sma"
  },
  {
    id: 4,
    name: "Grand Stade d'Agadir",
    city: "Agadir",
    capacity: 45480,
    image: "https://images.unsplash.com/photo-1627945037145-8120537482a0?q=80&w=1000&auto=format&fit=crop",
    description: "Le Stade Adrar est l'enceinte du Hassania d'Agadir (HUSA). Conçu par l'architecte Vittorio Gregotti, il se fond remarquablement dans le paysage de la région de Souss-Massa.",
    location: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3448.234567280951!2d-9.532313024505149!3d30.43580664219524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zR3JhbmQgU3RhZGUgZCdBZ2FkaXI!5e0!3m2!1sfr!2sma!4v1714080000000!5m2!1sfr!2sma"
  },
  {
    id: 5,
    name: "Stade de Fès",
    city: "Fès",
    capacity: 45000,
    image: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=1000&auto=format&fit=crop",
    description: "Ce complexe sportif, fief du Maghreb AS, est un monument de la ville spirituelle. Son architecture s'inspire de l'héritage arabo-andalou avec des touches modernes.",
    location: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3311.234567280951!2d-5.022313024505149!3d34.02580664219524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zU3RhZGUgZGUgRsOocw!5e0!3m2!1sfr!2sma!4v1714080000000!5m2!1sfr!2sma"
  },
  {
    id: 6,
    name: "Stade El Bachir",
    city: "Mohammedia",
    capacity: 10000,
    image: "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?q=80&w=1000&auto=format&fit=crop",
    description: "Base du SC Chabab Mohammedia, ce stade chaleureux et intimiste est réputé pour la ferveur de ses supporters et la beauté de sa pelouse.",
    location: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3320.234567280951!2d-7.392313024505149!3d33.68580664219524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zU3RhZGUgRWwgQmFjaGly!5e0!3m2!1sfr!2sma!4v1714080000000!5m2!1sfr!2sma"
  },
  {
    id: 7,
    name: "Stade Municipal de Berkane",
    city: "Berkane",
    capacity: 10000,
    image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1000&auto=format&fit=crop",
    description: "Le domicile de la RS Berkane, club devenu incontournable en Afrique. Un stade qui a connu d'innombrables soirées magiques lors des joutes continentales.",
    location: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.234567280951!2d-2.322313024505149!3d34.92580664219524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zU3RhZGUgTXVuaWNpcGFsIGRlIEJlcmthbmU!5e0!3m2!1sfr!2sma!4v1714080000000!5m2!1sfr!2sma"
  },
  {
    id: 8,
    name: "Stade Ahmed Choukri",
    city: "Zemamra",
    capacity: 5000,
    image: "https://images.unsplash.com/photo-1551280857-2b9bbe52afa4?q=80&w=1000&auto=format&fit=crop",
    description: "L'enceinte de la Renaissance Club Athletic Zemamra (RCAZ). Un complexe sportif en pleine évolution pour accompagner l'ascension du club dans l'élite.",
    location: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3345.234567280951!2d-8.702313024505149!3d32.62580664219524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zU3RhZGUgQWhtZWQgQ2hvdWtyaQ!5e0!3m2!1sfr!2sma!4v1714080000000!5m2!1sfr!2sma"
  },
  {
    id: 9,
    name: "Stade El Massira",
    city: "Safi",
    capacity: 15000,
    image: "https://images.unsplash.com/photo-1596420551061-0d32f419cbae?q=80&w=1000&auto=format&fit=crop",
    description: "Le stade de l'Olympique de Safi (OCS), réputé pour réunir l'un des publics les plus passionnés et bruyants du Maroc face à l'Océan Atlantique.",
    location: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3368.234567280951!2d-9.232313024505149!3d32.29580664219524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zU3RhZGUgRWwgTWFzc2lyYQ!5e0!3m2!1sfr!2sma!4v1714080000000!5m2!1sfr!2sma"
  },
  {
    id: 10,
    name: "Stade Municipal de Kénitra",
    city: "Kénitra",
    capacity: 25000,
    image: "https://images.unsplash.com/photo-1508344928928-7137b29de218?q=80&w=1000&auto=format&fit=crop",
    description: "Entièrement rénové récemment, ce stade historique du KAC Kénitra est prêt à accueillir de nouveau les grandes affiches du football marocain.",
    location: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3301.234567280951!2d-6.582313024505149!3d34.26580664219524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zU3RhZGUgTXVuaWNpcGFsIGRlIEvDqW5pdHJh!5e0!3m2!1sfr!2sma!4v1714080000000!5m2!1sfr!2sma"
  }
];

export const getStadiumById = (id: number) => STADIUMS.find(s => s.id === id);
