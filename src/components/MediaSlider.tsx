import { useState } from 'react'

export type Photo = { src: string; alt: string; caption: string }

function ArrowRight({ className = 'size-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function MediaSlider({ photos }: { photos: Photo[] }) {
  const [activeSlide, setActiveSlide] = useState(0)
  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="mx-auto grid max-w-[1400px] lg:grid-cols-2">
      <div className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <p className="section-kicker">Binnen en buiten de lijnen</p>
        <h2 className="font-display mt-4 text-5xl font-black uppercase leading-[0.88] tracking-[-0.03em] sm:text-7xl">
          Sfeer bij<br />The Eagles.
        </h2>
        <p className="mt-7 max-w-lg text-base leading-7 text-[#101B33]/70">
          Bekijk de vereniging door de ogen van onze spelers en supporters. Van wedstrijden tot gezellige momenten in de sporthal.
        </p>
        <div className="mt-8 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveSlide((activeSlide - 1 + photos.length) % photos.length)}
            className="flex size-11 items-center justify-center border border-[#101B33]/30 transition hover:bg-[#101B33] hover:text-white"
            aria-label="Vorige foto"
          >
            <ArrowRight className="size-4 rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => setActiveSlide((activeSlide + 1) % photos.length)}
            className="flex size-11 items-center justify-center border border-[#101B33]/30 transition hover:bg-[#101B33] hover:text-white"
            aria-label="Volgende foto"
          >
            <ArrowRight />
          </button>
          <span className="ml-2 text-xs font-bold tracking-[0.14em]">
            {pad(activeSlide + 1)} / {pad(photos.length)}
          </span>
        </div>
      </div>

      <div className="relative min-h-[480px] overflow-hidden bg-[#101B33]">
        {photos.map((photo, index) => (
          <img
            key={photo.src}
            src={photo.src}
            alt={index === activeSlide ? photo.alt : ''}
            loading={index === 0 ? 'eager' : 'lazy'}
            className={`absolute inset-0 size-full object-cover transition duration-500 ${
              index === activeSlide ? 'scale-100 opacity-80' : 'pointer-events-none scale-105 opacity-0'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-[#101B33]/80 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-7 text-white sm:p-10">
          <p className="font-display text-2xl font-bold uppercase">{photos[activeSlide].caption}</p>
          <div className="flex gap-1.5" aria-hidden="true">
            {photos.map((photo, index) => (
              <span key={photo.src} className={`h-1 transition-all ${index === activeSlide ? 'w-8 bg-[#FFD400]' : 'w-3 bg-white/40'}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
