export const site = {
  name: "TIMELESS",
  tagline: "Luxury Lounges",
  description: "Official website of the TIMELESS Luxury Lounges chain.",
  heroTitle: "Timeless",
  heroHeading: "Art of taste",
  heroText: "We craft extraordinary flavours and signature cocktails",
  introTexts: ["beautiful place", "beautiful people"],
  preloaderSubtitle: "timeless LUXURY LOUNGES",
  preloaderText: "welcome home",
  ageNote:
    "18+. Kindly bring your original proof of age with you. See you at TIMELESS.",
};

export const navLinks = [
  { label: "Locations", href: "/locations" },
  { label: "Menu", href: "/#menu" },
  { label: "News", href: "/#ladder" },
];

export const overlayMenu = [
  {
    name: "Locations",
    children: [
      { name: "All locations", href: "/locations" },
      { name: "Moscow-city", href: "/locations" },
      { name: "Yakimanka", href: "/locations" },
      { name: "Novy Arbat", href: "/locations" },
      { name: "Okhotny Ryad", href: "/locations" },
      { name: "Mayakovskaya", href: "/locations" },
      { name: "Chistye Prudy", href: "/locations" },
    ],
  },
  {
    name: "Menu",
    children: [
      { name: "Flavours", href: "/#menu" },
      { name: "Bar", href: "/#menu" },
      { name: "Snacks", href: "/#menu" },
    ],
  },
  {
    name: "About us",
    children: [
      { name: "About timeless", href: "/#ladder" },
      { name: "News", href: "/#ladder" },
    ],
  },
];

export const overlayExtras = [
  { name: "Catering", href: "/locations" },
  { name: "Franchise", href: "/locations" },
  { name: "Consulting", href: "/locations" },
  { name: "Careers", href: "/locations" },
  { name: "Shop", href: "/locations", soon: true },
  { name: "Contacts", href: "/locations" },
];

export type PortalShape =
  | "rectangle"
  | "ovals"
  | "square"
  | "rings"
  | "triangles"
  | "trapezoid"
  | "eight";

export type Location = {
  id: string;
  codeName: string;
  name: string;
  city: string;
  address: string;
  metro: string;
  phone: string;
  telegram: string;
  hours: string;
  image: string;
  portrait: string;
  shape: PortalShape;
  isNew?: boolean;
};

export const locations: Location[] = [
  {
    id: "moscow-city",
    codeName: "TIMELESS 6",
    name: "Moscow-city",
    city: "Moscow",
    address: "Neva Towers, 2nd floor",
    metro: "m. Moscow-City",
    phone: "+7 (916) 850-90-02",
    telegram: "@timeless_city",
    hours: "Mon — Sun: 12:00 — 03:00",
    image:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1600&q=80",
    portrait:
      "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1200&q=80",
    shape: "rectangle",
  },
  {
    id: "yakimanka",
    codeName: "TIMELESS 54",
    name: "Yakimanka",
    city: "Moscow",
    address: "Bolshaya Yakimanka, 22",
    metro: "m. Polyanka",
    phone: "+7 (980) 213-16-27",
    telegram: "@timeless_yakimanka",
    hours: "Mon — Sun: 12:00 — 03:00",
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=80",
    portrait:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    shape: "ovals",
  },
  {
    id: "novy-arbat",
    codeName: "TIMELESS 45",
    name: "Novy Arbat",
    city: "Moscow",
    address: "Novy Arbat, 28",
    metro: "m. Smolenskaya",
    phone: "+7 (985) 502-07-77",
    telegram: "@timeless_arbat",
    hours: "Mon — Sun: 12:00 — 03:00",
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80",
    portrait:
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
    shape: "square",
  },
  {
    id: "okhotny-ryad",
    codeName: "TIMELESS 3",
    name: "Okhotny Ryad",
    city: "Moscow",
    address: "Nikitsky per, 7, building 1",
    metro: "m. Okhotny Ryad",
    phone: "+7 (916) 410-50-54",
    telegram: "@timeless_okhotny_ryad",
    hours: "Mon — Sun: 12:00 — 03:00",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80",
    portrait:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80",
    shape: "rings",
  },
  {
    id: "mayakovskaya",
    codeName: "TIMELESS 2",
    name: "Mayakovskaya",
    city: "Moscow",
    address: "Blagoveshchensky per, 1a",
    metro: "m. Mayakovskaya",
    phone: "+7 (915) 151-35-34",
    telegram: "@timeless_mayakovskaya",
    hours: "Mon — Sun: 12:00 — 03:00",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80",
    portrait:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80",
    shape: "triangles",
  },
  {
    id: "chistye-prudy",
    codeName: "TIMELESS 1",
    name: "Chistye Prudy",
    city: "Moscow",
    address: "Milyutinsky per, 15",
    metro: "m. Chistye Prudy",
    phone: "+7 (985) 816-84-41",
    telegram: "@timeless_chistye_prudy",
    hours: "Mon — Sun: 12:00 — 03:00",
    image:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1600&q=80",
    portrait:
      "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1200&q=80",
    shape: "trapezoid",
  },
  {
    id: "dubai",
    codeName: "TIMELESS DUBAI",
    name: "TIMELESS DUBAI",
    city: "Dubai",
    address: "Al Habtoor City, Meera Tower",
    metro: "Al Habtoor City",
    phone: "+971 50 204 9987",
    telegram: "@timeless_dubai",
    hours: "Mon — Sun: 12:00 — 03:00",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80",
    portrait:
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80",
    shape: "eight",
    isNew: true,
  },
];

export type Product = {
  name: string;
  description: string;
  price?: string;
  showPrice?: boolean;
  image: string;
};

export type MenuCategory = {
  slug: string;
  name: string;
  specialTitle: string;
  specialDescription: string;
  btnLabel: string;
  image: string;
  menuImage: string;
  products: Product[];
};

export const menuCategories: MenuCategory[] = [
  {
    slug: "flavours",
    name: "Flavours",
    specialTitle: "Hookah special",
    specialDescription: "Mixology as art, hookahs as masterpieces.",
    btnLabel: "Flavours menu",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80",
    menuImage:
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1600&q=80",
    products: [
      {
        name: "Summer bazaar",
        description: "The flavor of iced green tea with lemon and field herbs.",
        image:
          "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "MONOCHROME",
        description:
          "Handcrafted chrome plated metal. Refreshing aroma of blueberries, flowers, root beer and bourbon.",
        image:
          "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "BOO",
        description:
          "A toy with a soft texture and a bold character. Aroma of red ripe berries, strawberry jam and lemon liqueur.",
        price: "15 000 ₽",
        showPrice: true,
        image:
          "https://images.unsplash.com/photo-1481391319762-47dff72990d5?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  {
    slug: "bar",
    name: "Bar",
    specialTitle: "Bar special",
    specialDescription: "Stronger drinks for stronger bonds.",
    btnLabel: "Bar menu",
    image:
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1600&q=80",
    menuImage:
      "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=1600&q=80",
    products: [
      {
        name: "BEET ME",
        description:
          "Gastronomic purple sour with tonka bean infused rum, pomegranate, blackcurrant and beetroot juice.",
        price: "135 ml / 1 000 ₽",
        showPrice: true,
        image:
          "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "CRYSTAL",
        description:
          "Gimlet with Norman Calvados, cider syrup with pear and pandan. Served with cider jelly.",
        price: "100 ml / 1 500 ₽",
        showPrice: true,
        image:
          "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "LUST CHERRY",
        description:
          "Our hit cocktail with a bright cherry-almond aroma, shades of palo santo and vanilla.",
        price: "100 ml / 1 800 ₽",
        showPrice: true,
        image:
          "https://images.unsplash.com/photo-1609951651556-5334e2706168?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  {
    slug: "snacks",
    name: "Snacks",
    specialTitle: "Gastro special",
    specialDescription: "Timeless classics in taste, elegance in presentation.",
    btnLabel: "Snack menu",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80",
    menuImage:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80",
    products: [
      {
        name: "LASAGNA",
        description: "with turkey, cheese and basil.",
        image:
          "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "BURRATA WITH TOMATOES",
        description: "And greek dressing.",
        image:
          "https://images.unsplash.com/photo-1608897013039-887f21dba900?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
];

export const ladderSlides = [
  {
    text: "Creating refined and impeccable bars…",
    link: { name: "About us", href: "/locations" },
  },
  {
    text: "…an experience beyond compare",
    link: { name: "Club card", href: "/locations" },
  },
  {
    text: "TIMELESS is a celebration of aesthetics, emotions, and desire…",
    link: { name: "Locations", href: "/locations" },
  },
  {
    text: "…the irresistible desire to return again and again",
    link: null,
  },
];

export const socials = [
  { name: "instagram", href: "https://www.instagram.com/timeless_moscow" },
  { name: "YouTube", href: "https://www.youtube.com" },
  { name: "Telegram", href: "https://t.me/timeless_moscow" },
];
