'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Leaf } from 'lucide-react'

export default function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false)

  return (
    <nav className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-green-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="text-green-700 w-6 h-6" />
            <span className="text-xl font-bold text-green-800">Yoga com Ana</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-green-700 hover:text-green-900 font-medium transition-colors">
              Início
            </Link>
            <Link href="/#sobre" className="text-green-700 hover:text-green-900 font-medium transition-colors">
              Sobre
            </Link>
            <Link href="/#aulas-info" className="text-green-700 hover:text-green-900 font-medium transition-colors">
              Modalidades
            </Link>
            <Link href="/aulas" className="btn-primary text-sm py-2 px-5">
              Reservar Aula
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-green-700"
            onClick={() => setMenuAberto(!menuAberto)}
          >
            {menuAberto ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuAberto && (
          <div className="md:hidden py-4 border-t border-green-100 flex flex-col gap-4">
            <Link href="/" className="text-green-700 font-medium" onClick={() => setMenuAberto(false)}>
              Início
            </Link>
            <Link href="/#sobre" className="text-green-700 font-medium" onClick={() => setMenuAberto(false)}>
              Sobre
            </Link>
            <Link href="/#aulas-info" className="text-green-700 font-medium" onClick={() => setMenuAberto(false)}>
              Modalidades
            </Link>
            <Link href="/aulas" className="btn-primary text-sm text-center" onClick={() => setMenuAberto(false)}>
              Reservar Aula
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
