import type { Metadata } from "next";
import GalleryClient from "./GalleryClient";

export const metadata: Metadata = {
  title: "Photography Gallery",
  description: "Explore the professional photography showcase of Mark Raymond Ayade. Highlighting landscape, street, architecture, macro, and astrophotography snapshots with detailed EXIF technical specs.",
  keywords: [
    "Mark Raymond Ayade",
    "Photography",
    "Sony Alpha",
    "Landscape Photography",
    "Street Photography",
    "EXIF Metadata",
    "Astrophotography"
  ]
};

export default function GalleryPage() {
  return <GalleryClient />;
}
