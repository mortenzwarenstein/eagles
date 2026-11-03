import { useState } from 'react'

type Props = {
  variant: 'home' | 'schedule'
  logoSrc: string
}

const homeNav = [
  { label: 'Teams', href: '#teams' },
  { label: 'Wedstrijden', href: '#fixtures' },
  { label: 'Uitslagen', href: '#results' },
  { label: 'Media', href: '#media' },
  { label: 'Roosters', href: '/roosters' },
]

const scheduleNav = [
  { label: 'Teams', href: '/#teams' },
  { label: 'Wedstrijden', href: '/#fixtures' },
  { label: 'Uitslagen', href: '/#results' },
  { label: 'Media', href: '/#media' },
]

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {open ? (
        <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      )}
    </svg>
  )
}

export default function Header({ variant, logoSrc }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const isHome = variant === 'home'
  const navItems = isHome ? homeNav : scheduleNav

  return (
    <header
      className={
        isHome
          ? 'absolute inset-x-0 top-0 z-30 border-b border-white/20 bg-white/10 text-white'
          : 'relative z-30 bg-[#101B33]/80 text-white'
      }
    >
      <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <a href={isHome ? '#top' : '/'} className="flex items-center gap-3" aria-label="Startpagina van UBV The Eagles">
          {isHome ? (
            <div className="crest crest-plain">
              <img src={logoSrc} alt="Logo van UBV The Eagles" />
            </div>
          ) : (
            <span className="flex h-14 w-14 items-center justify-center">
              <img src={logoSrc} alt="Logo van UBV The Eagles" className="size-full object-contain" />
            </span>
          )}
          <span className="font-display text-xl font-bold uppercase leading-none tracking-[0.06em] text-[#FFD400]">
            UBV<br />The Eagles
          </span>
        </a>

        <nav className={`hidden items-center md:flex ${isHome ? 'gap-9' : 'gap-8'}`} aria-label="Hoofdnavigatie">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`text-xs font-bold uppercase tracking-[0.15em] transition hover:text-[#FFD400] ${isHome ? 'text-white/80' : 'text-white/70'}`}
            >
              {item.label}
            </a>
          ))}
          {!isHome && (
            <span className="border-b border-[#FFD400] pb-1 text-xs font-bold uppercase tracking-[0.15em] text-[#FFD400]">Roosters</span>
          )}
        </nav>

        <button
          type="button"
          className="flex size-10 items-center justify-center border border-white/30 md:hidden"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label="Navigatie openen of sluiten"
          aria-expanded={menuOpen}
        >
          <MenuIcon open={menuOpen} />
        </button>
      </div>

      {menuOpen && (
        <nav
          className={`border-t bg-[#101B33] px-5 py-6 md:hidden ${isHome ? 'border-white/20' : 'border-white/15'}`}
          aria-label="Mobiele navigatie"
        >
          <div className="flex flex-col gap-5">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)} className="font-display text-2xl font-bold uppercase">
                {item.label}
              </a>
            ))}
            {!isHome && <span className="font-display text-2xl font-bold uppercase text-[#FFD400]">Roosters</span>}
          </div>
        </nav>
      )}
    </header>
  )
}
