'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Leaf } from 'lucide-react'

export default function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false)

  return (
    <nav className="bg-cream/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-sage">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="text-terra w-6 h-6" />
            <span className="text-xl font-bold text-plum tracking-wide">INTUIR YOGA</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-plum hover:text-terra font-medium transition-colors">
              Início
            </Link>
            <Link href="/#sobre" className="text-plum hover:text-terra font-medium transition-colors">
              Sobre
            </Link>
            <Link href="/#aulas-info" className="text-plum hover:text-terra font-medium transition-colors">
              Experiências com Yoga
            </Link>
            <Link href="/aulas" className="btn-primary text-sm py-2 px-5">
              Comprar Experiência
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-plum"
            onClick={() => setMenuAberto(!menuAberto)}
          >
            {menuAberto ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuAberto && (
          <div className="md:hidden py-4 border-t border-sage flex flex-col gap-4">
            <Link href="/" className="text-plum font-medium" onClick={() => setMenuAberto(false)}>
              Início
            </Link>
            <Link href="/#sobre" className="text-plum font-medium" onClick={() => setMenuAberto(false)}>
              Sobre
            </Link>
            <Link href="/#aulas-info" className="text-plum font-medium" onClick={() => setMenuAberto(false)}>
              Experiências com Yoga
            </Link>
            <Link href="/aulas" className="btn-primary text-sm text-center" onClick={() => setMenuAberto(false)}>
              Comprar Experiência
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
