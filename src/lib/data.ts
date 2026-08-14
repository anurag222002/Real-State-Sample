export const site = {
  name: "MERIDIAN",
  legalName: "Meridian Urban Real Estate Collection",
  tagline: "Urban Real Estate Collection",
  description:
    "A design-led developer of residences, workplaces and mixed-use landmarks. Seven decades of building with quality before profit.",
  heroTitle: "Meridian",
  heroHeading: "The legacy beyond compare",
  heroText:
    "Residences, workplaces and landmarks built to outlive the era that made them.",
  introTexts: ["land with intent", "build with restraint", "hold for decades"],
  preloaderSubtitle: "meridian URBAN REAL ESTATE",
  preloaderText: "we build legacies",
  established: "Est. 1954",
  reraNote:
    "MahaRERA registered. Renders are artistic impressions and do not constitute a legal offering.",
};

export const navLinks = [
  { label: "Collection", href: "/collection" },
  { label: "Legacy", href: "/#legacy" },
  { label: "Principles", href: "/#principles" },
];

export const overlayMenu = [
  {
    name: "The Collection",
    children: [
      { name: "All developments", href: "/collection" },
      { name: "Aurum Park", href: "/collection" },
      { name: "Meridian One", href: "/collection" },
      { name: "Stone Court", href: "/collection" },
      { name: "Sky Terraces", href: "/collection" },
    ],
  },
  {
    name: "The Company",
    children: [
      { name: "Our legacy", href: "/#legacy" },
      { name: "Living by principles", href: "/#principles" },
      { name: "Design philosophy", href: "/#philosophy" },
      { name: "How we build", href: "/#process" },
    ],
  },
];

export const overlayExtras = [
  { name: "Media & insights", href: "/collection" },
  { name: "Channel partners", href: "/collection" },
  { name: "Careers", href: "/collection" },
  { name: "NRI desk", href: "/collection", soon: true },
  { name: "Contact", href: "/collection" },
];

export type PortalShape =
  | "tower"
  | "arch"
  | "plinth"
  | "aperture"
  | "chamfer"
  | "louvre"
  | "monolith";

export type ProjectStatus =
  | "New launch"
  | "Under construction"
  | "Nearing possession"
  | "Delivered";

export type Project = {
  id: string;
  code: string;
  name: string;
  typology: string;
  city: string;
  address: string;
  configuration: string;
  scale: string;
  status: ProjectStatus;
  rera: string;
  image: string;
  portrait: string;
  shape: PortalShape;
  flagship?: boolean;
};

export const projects: Project[] = [
  {
    id: "aurum-park",
    code: "01",
    name: "Aurum Park",
    typology: "High-rise residences",
    city: "Mumbai",
    address: "Off Link Road, Andheri West",
    configuration: "3 & 4 BHK · 1,480 – 2,340 sq ft",
    scale: "2 towers · 41 floors",
    status: "Under construction",
    rera: "P51800054321",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=80",
    portrait:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    shape: "tower",
    flagship: true,
  },
  {
    id: "meridian-one",
    code: "02",
    name: "Meridian One",
    typology: "Grade-A workplace",
    city: "Mumbai",
    address: "G Block, Bandra Kurla Complex",
    configuration: "Floor plates of 21,000 sq ft",
    scale: "1 tower · 28 floors",
    status: "Nearing possession",
    rera: "P51800061204",
    image:
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1800&q=80",
    portrait:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    shape: "monolith",
  },
  {
    id: "stone-court",
    code: "03",
    name: "Stone Court",
    typology: "Low-rise villas",
    city: "Alibaug",
    address: "Awas Beach Road",
    configuration: "4 BHK villas · 4,100 sq ft",
    scale: "18 villas · 6 acres",
    status: "New launch",
    rera: "P52000048117",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=80",
    portrait:
      "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80",
    shape: "plinth",
  },
  {
    id: "sky-terraces",
    code: "04",
    name: "Sky Terraces",
    typology: "Sky residences",
    city: "Mumbai",
    address: "Dr. Annie Besant Road, Worli",
    configuration: "4 & 5 BHK · 3,200 – 5,600 sq ft",
    scale: "1 tower · 52 floors",
    status: "Delivered",
    rera: "P51900032890",
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1800&q=80",
    portrait:
      "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80",
    shape: "aperture",
  },
  {
    id: "the-civic",
    code: "05",
    name: "The Civic",
    typology: "Mixed-use precinct",
    city: "Pune",
    address: "Mundhwa Riverfront",
    configuration: "Retail, offices & serviced homes",
    scale: "3 blocks · 11 acres",
    status: "Under construction",
    rera: "P52100055602",
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1800&q=80",
    portrait:
      "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?auto=format&fit=crop&w=1200&q=80",
    shape: "chamfer",
  },
  {
    id: "greenfield-enclave",
    code: "06",
    name: "Greenfield Enclave",
    typology: "Plotted development",
    city: "Nashik",
    address: "Gangapur Road Extension",
    configuration: "Plots of 2,400 – 6,000 sq ft",
    scale: "184 plots · 24 acres",
    status: "New launch",
    rera: "P52200059431",
    image:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1800&q=80",
    portrait:
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=80",
    shape: "louvre",
  },
];

export type Principle = {
  slug: string;
  index: string;
  name: string;
  statement: string;
  description: string;
  proof: string;
  image: string;
  detailImage: string;
  points: { name: string; description: string }[];
};

export const principles: Principle[] = [
  {
    slug: "trust",
    index: "01",
    name: "Trust",
    statement: "Quality before profit, trust before everything",
    description:
      "Every allotment is backed by clear title, escrowed collections and a handover date we publish before we sell.",
    proof: "Zero litigated titles across 42 developments",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=80",
    detailImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    points: [
      {
        name: "Clear title",
        description:
          "Independent legal audit published in every allotment kit.",
      },
      {
        name: "Escrowed funds",
        description: "Collections ring-fenced per project, audited quarterly.",
      },
      {
        name: "Published dates",
        description: "Committed handover, tracked publicly through delivery.",
      },
    ],
  },
  {
    slug: "quality",
    index: "02",
    name: "Quality",
    statement: "Built once, built to hold its line",
    description:
      "Structural design to IS-1893 seismic standards, imported formwork for flatness, and a 200-point checklist before any key changes hands.",
    proof: "200-point handover checklist per home",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1800&q=80",
    detailImage:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1600&q=80",
    points: [
      {
        name: "Aluminium formwork",
        description: "Monolithic pours for true walls and tighter tolerances.",
      },
      {
        name: "Facade testing",
        description: "Mock-ups water-tested before the first panel is fixed.",
      },
      {
        name: "Snag-free keys",
        description: "Third-party inspection signs off ahead of possession.",
      },
    ],
  },
  {
    slug: "transparency",
    index: "03",
    name: "Transparency",
    statement: "The drawing you see is the building you get",
    description:
      "Carpet areas, loading, specifications and construction progress are shared monthly — in writing, with photographs, without prompting.",
    proof: "Monthly progress reports to every buyer",
    image:
      "https://images.unsplash.com/photo-1592595896551-12b371d546d5?auto=format&fit=crop&w=1800&q=80",
    detailImage:
      "https://images.unsplash.com/photo-1626178793926-22b28830aa30?auto=format&fit=crop&w=1600&q=80",
    points: [
      {
        name: "Carpet-area first",
        description: "Pricing quoted on RERA carpet, never on inflated saleable.",
      },
      {
        name: "Live progress",
        description: "Slab-by-slab updates with site photography each month.",
      },
      {
        name: "Fixed specification",
        description: "Material schedule locked at booking, changes only upward.",
      },
    ],
  },
  {
    slug: "innovation",
    index: "04",
    name: "Innovation",
    statement: "IGBC-aligned by design, not by retrofit",
    description:
      "Orientation studies, low-E glazing, rainwater harvesting and 30% recycled content are decided at concept stage, where they still cost nothing.",
    proof: "IGBC Gold targeted across the collection",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1800&q=80",
    detailImage:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80",
    points: [
      {
        name: "Passive first",
        description: "Solar studies shape massing before mechanical cooling.",
      },
      {
        name: "Water positive",
        description: "Harvesting and recycling sized for the full occupancy.",
      },
      {
        name: "Low-carbon mix",
        description: "GGBS concrete and regional stone reduce embodied carbon.",
      },
    ],
  },
];

export const riseSlides = [
  {
    text: "For seventy years we have built on the same oath…",
    link: { name: "Our legacy", href: "/#legacy" },
  },
  {
    text: "…quality before profit, trust before everything",
    link: { name: "Our principles", href: "/#principles" },
  },
  {
    text: "A building is a promise poured in concrete…",
    link: { name: "The collection", href: "/collection" },
  },
  {
    text: "…and we intend to keep it for generations",
    link: null,
  },
];

export type Phase = {
  code: string;
  name: string;
  duration: string;
  description: string;
};

export const phases: Phase[] = [
  {
    code: "01",
    name: "Land & diligence",
    duration: "4 – 7 months",
    description:
      "Title search, soil investigation and feasibility. If the land cannot be clean, we walk away.",
  },
  {
    code: "02",
    name: "Design & approvals",
    duration: "8 – 12 months",
    description:
      "Architecture, structure and services resolved together, then taken through statutory approvals.",
  },
  {
    code: "03",
    name: "Foundation & structure",
    duration: "14 – 22 months",
    description:
      "Piling, raft and monolithic slab cycles at a published rate of one floor every seven days.",
  },
  {
    code: "04",
    name: "Facade & services",
    duration: "10 – 14 months",
    description:
      "Glazing, plumbing, electrical and HVAC installed against tested mock-ups.",
  },
  {
    code: "05",
    name: "Finishes & handover",
    duration: "6 – 9 months",
    description:
      "Fit-out, third-party snagging and a 200-point sign-off before keys are released.",
  },
];

export const stats = [
  { value: 71, suffix: "", label: "Years of building" },
  { value: 42, suffix: "", label: "Developments delivered" },
  { value: 6.5, suffix: "M", label: "Sq ft completed" },
  { value: 12, suffix: "K", label: "Families housed" },
];

export const partners = [
  {
    name: "Goonmeet Chauhan",
    role: "Principal Architect",
    quote:
      "We were asked to sculpt Meridian as a contemporary residential landmark — an address where design elegance is interwoven with functional planning.",
    image:
      "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Bobby Mukherjee",
    role: "Interior Design",
    quote:
      "The clubhouse and tower lobbies are conceived for refined luxury and a strong spatial identity that ages slowly and gracefully.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Rohan Deshpande",
    role: "Structural Engineering",
    quote:
      "Seismic design, wind tunnel validation and a seven-day slab cycle — the engineering here is held to infrastructure standards, not housing ones.",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
  },
];

export const socials = [
  { name: "Instagram", href: "https://www.instagram.com" },
  { name: "LinkedIn", href: "https://www.linkedin.com" },
  { name: "YouTube", href: "https://www.youtube.com" },
];

export const budgets = [
  "₹2 – 4 Cr",
  "₹4 – 7 Cr",
  "₹7 – 12 Cr",
  "₹12 Cr and above",
  "Commercial enquiry",
];
