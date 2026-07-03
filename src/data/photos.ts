export interface CameraSpecs {
  model: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: string;
}

export interface Photo {
  id: string;
  title: string;
  description: string;
  category: 'Landscape' | 'Street' | 'Architecture' | 'Macro' | 'Astro' | 'Portrait';
  images: string[];
  location: string;
  date: string;
  camera: CameraSpecs;
  colors: string[];
}

export const PHOTOS: Photo[] = [
  {
    id: "lapu-lapu",
    title: "Lapu-Lapu Monument",
    description: "",
    category: "Street",
    images: [
      "/images/gallery/llc-3pic.jpg",
      "/images/gallery/llc-lapu2.jpg",
      "/images/gallery/llc-sunset.jpg",
      "/images/gallery/llc-bag.jpg"
    ],
    location: "Lapu-Lapu Shrine, Cebu City, Philippines",
    date: "May 2026",
    camera: {
      model: "FujiFilm XS20"
    },
    colors: []
  },
  {
    id: "mountain-reflection",
    title: "Alpenglow Reflection",
    description: "Captured during the brief moments of twilight where the mountain peaks catch the last red rays of sunlight while the lake remains in quiet, cool shadow.",
    category: "Landscape",
    images: [
      "/images/gallery/mountain-reflection.png",
      "/images/gallery/neon-street.png",
      "/images/gallery/modern-concrete.png"
    ],
    location: "Moraine Lake, Canada",
    date: "Oct 2025",
    camera: {
      model: "Sony Alpha 7R V",
      lens: "FE 24-70mm F2.8 GM II",
      focalLength: "28mm",
      aperture: "f/8.0",
      shutterSpeed: "1/4s",
      iso: "100"
    },
    colors: ["#1e293b", "#334155", "#475569", "#94a3b8", "#e2e8f0"]
  },
  {
    id: "neon-street",
    title: "Cyberpunk Rain",
    description: "Rainy alleyways of Shinjuku lit by vibrant pink and blue neon advertisements, highlighting the reflections on wet pavement.",
    category: "Street",
    images: [
      "/images/gallery/neon-street.png",
      "/images/gallery/mountain-reflection.png",
      "/images/gallery/cat-eyes.png"
    ],
    location: "Shinjuku, Tokyo",
    date: "Nov 2025",
    camera: {
      model: "Sony Alpha 7S III",
      lens: "FE 50mm F1.2 GM",
      focalLength: "50mm",
      aperture: "f/1.2",
      shutterSpeed: "1/160s",
      iso: "800"
    },
    colors: ["#0f172a", "#1e1b4b", "#4c1d95", "#db2777", "#06b6d4"]
  },
  {
    id: "modern-concrete",
    title: "Geometric Shadows",
    description: "A study of minimalist architecture where clean concrete planes meet deep shadows under a cloudless sky, emphasizing line and form.",
    category: "Architecture",
    images: [
      "/images/gallery/modern-concrete.png",
      "/images/gallery/morning-dew.png",
      "/images/gallery/milky-way-pines.png"
    ],
    location: "Copenhagen, Denmark",
    date: "Aug 2025",
    camera: {
      model: "Sony Alpha 7 IV",
      lens: "FE 16-35mm F4 G PZ",
      focalLength: "18mm",
      aperture: "f/5.6",
      shutterSpeed: "1/500s",
      iso: "100"
    },
    colors: ["#0f172a", "#1e293b", "#64748b", "#cbd5e1", "#f8fafc"]
  },
  {
    id: "morning-dew",
    title: "Spun Glass",
    description: "Perfect dew drops clinging to a spider's web, catching the soft morning sun and reflecting miniature images of the surrounding forest.",
    category: "Macro",
    images: [
      "/images/gallery/morning-dew.png",
      "/images/gallery/mountain-reflection.png"
    ],
    location: "Kyoto Forest, Japan",
    date: "May 2025",
    camera: {
      model: "Sony Alpha 7R V",
      lens: "FE 90mm F2.8 Macro G OSS",
      focalLength: "90mm",
      aperture: "f/4.0",
      shutterSpeed: "1/200s",
      iso: "400"
    },
    colors: ["#064e3b", "#047857", "#10b981", "#6ee7b7", "#d1fae5"]
  },
  {
    id: "milky-way-pines",
    title: "Celestial Sentinel",
    description: "The glowing core of the Milky Way galaxy rising behind a majestic lone pine tree, showing the sheer scale of the cosmos.",
    category: "Astro",
    images: [
      "/images/gallery/milky-way-pines.png",
      "/images/gallery/neon-street.png"
    ],
    location: "Yosemite Valley, USA",
    date: "Jul 2025",
    camera: {
      model: "Sony Alpha 7S III",
      lens: "FE 14mm F1.8 GM",
      focalLength: "14mm",
      aperture: "f/1.8",
      shutterSpeed: "20s",
      iso: "3200"
    },
    colors: ["#020617", "#0b132b", "#1c2541", "#3a506b", "#5bc0be"]
  },
  {
    id: "cat-eyes",
    title: "Emerald Hunter",
    description: "A close-up portrait of a domestic black cat, with low-key studio lighting that brings out the vibrant emerald green color of the eyes and details of the whiskers.",
    category: "Portrait",
    images: [
      "/images/gallery/cat-eyes.png",
      "/images/gallery/modern-concrete.png"
    ],
    location: "Indoor Studio",
    date: "Jan 2026",
    camera: {
      model: "Sony Alpha 7 IV",
      lens: "FE 85mm F1.4 GM",
      focalLength: "85mm",
      aperture: "f/1.4",
      shutterSpeed: "1/250s",
      iso: "200"
    },
    colors: ["#090d16", "#14213d", "#fca311", "#e5e5e5", "#ffffff"]
  }
];
