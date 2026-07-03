"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { PHOTOS, type Photo } from "@/data/photos";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faMapMarkerAlt,
  faCalendarAlt,
  faTimes,
  faChevronLeft,
  faChevronRight,
  faExpand,
  faSlidersH,
  faMicrochip,
  faEye,
  faCircle,
  faCompass,
  faChevronUp,
  faChevronDown,
  faImages,
} from "@fortawesome/free-solid-svg-icons";

export default function GalleryClient() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleSelectPhoto = (photo: Photo) => {
    setSelectedPhoto(photo);
    setShowAllSpecs(false);
    setActiveImageIndex(0);
  };

  const hasOptionalSpecs = selectedPhoto ? !!(
    selectedPhoto.camera.lens ||
    selectedPhoto.camera.aperture ||
    selectedPhoto.camera.shutterSpeed ||
    selectedPhoto.camera.focalLength ||
    selectedPhoto.camera.iso
  ) : false;

  // Animate grid items on load
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const categories = ["All", "Landscape", "Street", "Architecture", "Macro", "Astro", "Portrait"];

  const filteredPhotos = activeCategory === "All"
    ? PHOTOS
    : PHOTOS.filter(photo => photo.category === activeCategory);

  const handlePrevGalleryItem = useCallback(() => {
    if (!selectedPhoto) return;
    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id);
    const prevIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    handleSelectPhoto(filteredPhotos[prevIndex]);
  }, [selectedPhoto, filteredPhotos]);

  const handleNextGalleryItem = useCallback(() => {
    if (!selectedPhoto) return;
    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id);
    const nextIndex = (currentIndex + 1) % filteredPhotos.length;
    handleSelectPhoto(filteredPhotos[nextIndex]);
  }, [selectedPhoto, filteredPhotos]);

  const handlePrevSubImage = useCallback(() => {
    if (!selectedPhoto) return;
    setActiveImageIndex((prevIndex) => 
      (prevIndex - 1 + selectedPhoto.images.length) % selectedPhoto.images.length
    );
  }, [selectedPhoto]);

  const handleNextSubImage = useCallback(() => {
    if (!selectedPhoto) return;
    setActiveImageIndex((prevIndex) => 
      (prevIndex + 1) % selectedPhoto.images.length
    );
  }, [selectedPhoto]);

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPhoto) return;
      if (e.key === "ArrowLeft") handlePrevSubImage();
      if (e.key === "ArrowRight") handleNextSubImage();
      if (e.key === "Escape") setSelectedPhoto(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhoto, handlePrevSubImage, handleNextSubImage]);

  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <main className="relative min-h-screen bg-[var(--color-background)] pt-24 pb-20 px-6 overflow-hidden">
      {/* Dynamic inline styles for smooth CSS transitions */}
      <style jsx global>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalScaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes cardFadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-modal-fade {
          animation: modalFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-modal-scale {
          animation: modalScaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-card-fade {
          animation: cardFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Ambient background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        <div 
          className="absolute top-[10%] left-[10%] w-[35vw] aspect-square rounded-full opacity-10 dark:opacity-[0.06] blur-[80px]"
          style={{ background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)" }}
        />
        <div 
          className="absolute bottom-[20%] right-[5%] w-[40vw] aspect-square rounded-full opacity-10 dark:opacity-[0.04] blur-[100px]"
          style={{ background: "radial-gradient(circle, #6366f1 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto z-10">
        {/* Header Section */}
        <section className="text-center mb-16 pt-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)]/55 shadow-sm text-xs font-semibold text-[var(--color-accent)] uppercase tracking-wider mb-5">
            <FontAwesomeIcon icon={faCamera} className="text-xs" />
            <span>Photography Hobbyist</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 bg-gradient-to-r from-[var(--color-foreground)] via-[var(--color-foreground)] to-[var(--color-accent)] bg-clip-text text-transparent">
            Photography Gallery
          </h1>
          <p className="text-base md:text-lg text-[var(--color-muted)] max-w-2xl mx-auto leading-relaxed">
            Capturing the intersection of light, symmetry, and atmosphere. A curated catalog of my creative observations through the lens.
          </p>
          <div className="w-16 h-1 bg-[var(--color-accent)] rounded-full mx-auto mt-8 opacity-80" />
        </section>

        {/* Category Selector */}
        <nav aria-label="Category filter" className="flex justify-center mb-12">
          <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-[var(--color-surface)]/80 backdrop-blur-md border border-[var(--color-border)]/40 rounded-2xl max-w-full overflow-x-auto shadow-sm">
            {categories.map((category) => {
              const isActive = activeCategory === category;
              const count = category === "All" 
                ? PHOTOS.length 
                : PHOTOS.filter(p => p.category === category).length;

              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                    isActive
                      ? "bg-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-accent)]/20"
                      : "text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-border)]/30"
                  }`}
                  aria-pressed={isActive}
                >
                  <span>{category}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold font-mono transition-colors ${
                    isActive ? "bg-white/20 text-white" : "bg-[var(--color-border)] text-[var(--color-muted)]"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Images Grid */}
        <div 
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-300 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          role="region"
          aria-label="Photography items grid"
        >
          {filteredPhotos.map((photo, index) => (
            <article
              key={photo.id}
              onClick={() => handleSelectPhoto(photo)}
              className="group relative flex flex-col bg-[var(--color-surface)] border border-[var(--color-border)]/50 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer animate-card-fade"
              style={{ animationDelay: `${index * 80}ms` }}
              id={`photo-card-${photo.id}`}
            >
              {/* Image Container */}
              <div className="relative aspect-[3/2] w-full overflow-hidden bg-black/10">
                <Image
                  src={photo.images[0]}
                  alt={photo.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  priority={index < 3}
                />
                {/* Series indicators */}
                {photo.images.length > 1 && (
                  <div className="absolute top-3.5 right-3.5 z-20 px-2.5 py-1 rounded-lg bg-black/55 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white flex items-center gap-1.5 shadow-sm pointer-events-none">
                    <FontAwesomeIcon icon={faImages} className="text-[10px] text-white/80" />
                    <span>Series</span>
                  </div>
                )}
                {/* Hover Visual Effect Overlay */}
                <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                  <div className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white text-sm scale-90 group-hover:scale-100 transition-all duration-300 border border-white/20">
                    <FontAwesomeIcon icon={faExpand} className="text-base" />
                  </div>
                </div>
              </div>

              {/* Info Container */}
              <div className="p-5.5 flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted)] mb-2">
                    <span className="px-2 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border)]/65">
                      {photo.category}
                    </span>
                    <span className="text-[var(--color-muted)] font-medium font-mono">
                      {photo.date}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-[var(--color-foreground)] transition-colors duration-300 line-clamp-1 mb-2">
                    {photo.title}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--color-muted)] mb-4">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[10px] text-[var(--color-muted)] shrink-0" />
                    <span>{photo.location}</span>
                  </div>
                </div>

                {/* Micro Tech Specs Block */}
                <div className="flex items-center gap-2 pt-3 border-t border-[var(--color-border)]/40 text-[10px] text-[var(--color-muted)] font-mono">
                  <FontAwesomeIcon icon={faCamera} className="text-[10px] text-[var(--color-muted)] opacity-50" />
                  <span className="line-clamp-1">
                    {photo.camera.model}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty state */}
        {filteredPhotos.length === 0 && (
          <div className="text-center py-20 bg-[var(--color-surface)]/50 rounded-3xl border border-[var(--color-border)]/30 backdrop-blur-sm">
            <FontAwesomeIcon icon={faCamera} className="text-4xl text-[var(--color-muted)] opacity-35 mb-4" />
            <h3 className="text-lg font-bold mb-1">No images found</h3>
            <p className="text-sm text-[var(--color-muted)]">No photographs found matching this category filter.</p>
          </div>
        )}
      </div>

      {/* Lightbox Focus Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-md animate-modal-fade"
          onClick={() => setSelectedPhoto(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Close trigger button on outer top-right corner for larger displays */}
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 z-55 w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-white flex items-center justify-center hover:scale-105 transition-all duration-200 cursor-pointer"
            aria-label="Close modal"
          >
            <FontAwesomeIcon icon={faTimes} className="text-base" />
          </button>

          {/* Modal Box */}
          <div
            className="relative w-full max-w-7xl h-[90vh] md:h-[85vh] bg-[var(--color-surface)] border border-[var(--color-border)]/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-modal-scale z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Section (Left) */}
            <div className="relative flex-grow bg-neutral-950 flex items-center justify-center min-h-[35vh] md:min-h-0 select-none">
              <div className="relative w-full h-full min-h-[35vh] md:min-h-[50vh]">
                <Image
                  src={selectedPhoto.images[activeImageIndex]}
                  alt={selectedPhoto.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 800px"
                  priority
                />
              </div>

              {/* Prev / Next controls for series images */}
              {selectedPhoto.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); handlePrevSubImage(); }}
                    className="absolute left-4 p-3 rounded-full bg-black/50 hover:bg-black/75 border border-white/10 text-white hover:scale-105 active:scale-95 transition-all duration-200 z-10 cursor-pointer"
                    aria-label="Previous series image"
                  >
                    <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleNextSubImage(); }}
                    className="absolute right-4 p-3 rounded-full bg-black/50 hover:bg-black/75 border border-white/10 text-white hover:scale-105 active:scale-95 transition-all duration-200 z-10 cursor-pointer"
                    aria-label="Next series image"
                  >
                    <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
                  </button>

                  {/* Horizontal indicator dots */}
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
                    {selectedPhoto.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => { e.stopPropagation(); setActiveImageIndex(idx); }}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          idx === activeImageIndex 
                            ? "bg-white w-4" 
                            : "bg-white/40 hover:bg-white/60"
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Quick visual details index marker */}
                  <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-sm border border-white/10 text-[10px] font-bold font-mono text-white/80 tracking-wider">
                    {activeImageIndex + 1} / {selectedPhoto.images.length}
                  </div>
                </>
              )}
            </div>

            {/* Content Details Panel (Right) */}
            <div className="w-full md:w-80 lg:w-[390px] bg-[var(--color-background)] border-t md:border-t-0 md:border-l border-[var(--color-border)]/45 p-7 md:p-8 flex flex-col justify-between overflow-y-auto custom-scrollbar select-text">
              <div>
                {/* Meta Category & Date */}
                <div className="flex items-center justify-between mb-6">
                  <span className="px-3 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border)]/65 text-[var(--color-muted)] text-[10px] font-bold uppercase tracking-wider">
                    {selectedPhoto.category}
                  </span>
                  <span className="text-[11px] text-[var(--color-muted)] font-semibold flex items-center gap-1.5 font-mono">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-[10px] text-[var(--color-muted)] opacity-60" />
                    {selectedPhoto.date}
                  </span>
                </div>

                {/* Title and Location */}
                <h2 id="modal-title" className="text-2xl md:text-3xl font-black tracking-tight text-[var(--color-foreground)] mb-3">
                  {selectedPhoto.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-[var(--color-muted)] mb-6">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xs text-[var(--color-muted)] opacity-70" />
                  <span>{selectedPhoto.location}</span>
                </div>

                {/* Story/Description (Conditional) */}
                {selectedPhoto.description && (
                  <div className="mb-8">
                    <p className="text-sm text-[var(--color-muted)] leading-relaxed italic border-l border-[var(--color-border)]/70 pl-4 py-1">
                      "{selectedPhoto.description}"
                    </p>
                  </div>
                )}

                {/* Technical Specifications */}
                <div className="mb-8 pt-6 border-t border-[var(--color-border)]/40">
                  <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--color-muted)] mb-4">
                    Technical Specifications
                  </h3>
                  
                  <div className="space-y-5">
                    {/* Main Details: Camera and Date */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                      {selectedPhoto.camera.model && (
                        <div>
                          <span className="block text-[9px] font-bold uppercase tracking-wider text-[var(--color-muted)]">Camera</span>
                          <span className="block text-xs font-semibold text-[var(--color-foreground)] mt-1">{selectedPhoto.camera.model}</span>
                        </div>
                      )}
                      {selectedPhoto.date && (
                        <div>
                          <span className="block text-[9px] font-bold uppercase tracking-wider text-[var(--color-muted)]">Date Captured</span>
                          <span className="block text-xs font-semibold text-[var(--color-foreground)] font-mono mt-1">{selectedPhoto.date}</span>
                        </div>
                      )}
                    </div>

                    {/* Optional Details (Collapsible) */}
                    {hasOptionalSpecs && showAllSpecs && (
                      <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-5 border-t border-[var(--color-border)]/30 animate-[modalFadeIn_0.2s_ease-out]">
                        {selectedPhoto.camera.lens && (
                          <div className="col-span-2">
                            <span className="block text-[9px] font-bold uppercase tracking-wider text-[var(--color-muted)]">Lens</span>
                            <span className="block text-xs font-semibold text-[var(--color-foreground)] mt-1 truncate" title={selectedPhoto.camera.lens}>
                              {selectedPhoto.camera.lens}
                            </span>
                          </div>
                        )}
                        {selectedPhoto.camera.aperture && (
                          <div>
                            <span className="block text-[9px] font-bold uppercase tracking-wider text-[var(--color-muted)]">Aperture</span>
                            <span className="block text-xs font-semibold text-[var(--color-foreground)] font-mono mt-1">
                              {selectedPhoto.camera.aperture}
                            </span>
                          </div>
                        )}
                        {selectedPhoto.camera.shutterSpeed && (
                          <div>
                            <span className="block text-[9px] font-bold uppercase tracking-wider text-[var(--color-muted)]">Shutter Speed</span>
                            <span className="block text-xs font-semibold text-[var(--color-foreground)] font-mono mt-1">
                              {selectedPhoto.camera.shutterSpeed}
                            </span>
                          </div>
                        )}
                        {selectedPhoto.camera.focalLength && (
                          <div>
                            <span className="block text-[9px] font-bold uppercase tracking-wider text-[var(--color-muted)]">Focal Length</span>
                            <span className="block text-xs font-semibold text-[var(--color-foreground)] font-mono mt-1">
                              {selectedPhoto.camera.focalLength}
                            </span>
                          </div>
                        )}
                        {selectedPhoto.camera.iso && (
                          <div>
                            <span className="block text-[9px] font-bold uppercase tracking-wider text-[var(--color-muted)]">ISO</span>
                            <span className="block text-xs font-semibold text-[var(--color-foreground)] font-mono mt-1">
                              {selectedPhoto.camera.iso}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Collapse Toggle Button */}
                    {hasOptionalSpecs && (
                      <button
                        onClick={() => setShowAllSpecs(!showAllSpecs)}
                        className="w-full text-left text-[9px] font-extrabold uppercase tracking-wider text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors py-2 flex items-center justify-between border-t border-[var(--color-border)]/30 mt-2 cursor-pointer"
                      >
                        <span>{showAllSpecs ? "Hide Technical Details" : "Show Technical Details"}</span>
                        <FontAwesomeIcon icon={showAllSpecs ? faChevronUp : faChevronDown} className="text-[8px] text-[var(--color-muted)]" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Color Swatch (Conditional) */}
                {selectedPhoto.colors && selectedPhoto.colors.length > 0 && (
                  <div className="mb-6 pt-6 border-t border-[var(--color-border)]/40">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--color-muted)]">
                        Color Palette
                      </h3>
                      {copiedColor && (
                        <span className="text-[9px] font-bold text-[var(--color-muted)] animate-pulse">
                          Copied {copiedColor}!
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedPhoto.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => handleCopyColor(color)}
                          className="w-7 h-7 rounded-full border border-white/20 shadow-sm cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200 relative group/swatch"
                          style={{ backgroundColor: color }}
                          title={`Copy color ${color}`}
                          aria-label={`Copy color ${color}`}
                        >
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-[9px] font-mono rounded opacity-0 group-hover/swatch:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 pointer-events-none">
                            {color}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Post Navigation */}
              <div className="flex items-center gap-3 pt-6 border-t border-[var(--color-border)]/40 mt-6 text-xs text-[var(--color-muted)] select-none">
                <button
                  onClick={handlePrevGalleryItem}
                  className="flex-grow py-2.5 px-3.5 rounded-xl border border-[var(--color-border)]/55 hover:border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 font-semibold text-center"
                >
                  <FontAwesomeIcon icon={faChevronLeft} className="text-[10px]" />
                  <span>Prev Post</span>
                </button>
                <button
                  onClick={handleNextGalleryItem}
                  className="flex-grow py-2.5 px-3.5 rounded-xl border border-[var(--color-border)]/55 hover:border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 font-semibold text-center"
                >
                  <span>Next Post</span>
                  <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
                </button>
              </div>

              {/* Close button inside modal pane */}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="w-full mt-4 py-3 rounded-xl bg-[var(--color-surface)] hover:bg-[var(--color-border)]/40 border border-[var(--color-border)]/60 hover:border-[var(--color-border)] text-sm font-semibold text-[var(--color-foreground)] transition-all duration-200 cursor-pointer text-center"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
