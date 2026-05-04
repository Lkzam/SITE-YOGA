import { Leaf, Phone, Mail, MapPin, AtSign } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-plum text-cream">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="w-5 h-5 text-terra" />
            <span className="text-lg font-bold text-white">Intuir Yoga</span>
          </div>
          <p className="text-cream/70 text-sm leading-relaxed">
            Intuir Yoga com Millena Bonomi — Encontre equilíbrio, paz e bem-estar
            através da prática de experiências com yoga. Para todos os níveis,
            do iniciante ao avançado.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Links Rápidos</h3>
          <div className="flex flex-col gap-2">
            <Link href="/" className="text-cream/70 hover:text-terra text-sm transition-colors">Início</Link>
            <Link href="/#sobre" className="text-cream/70 hover:text-terra text-sm transition-colors">Sobre Intuir Yoga</Link>
            <Link href="/aulas" className="text-cream/70 hover:text-terra text-sm transition-colors">Comprar evento</Link>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Contato</h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-cream/70 text-sm">
              <Phone size={14} className="text-terra shrink-0" />
              <span>(19) 974-086347</span>
            </div>
            <div className="flex items-center gap-2 text-cream/70 text-sm">
              <Mail size={14} className="text-terra shrink-0" />
              <span>intuiryoga26@gmail.com</span>
            </div>
            <div className="flex items-center gap-2 text-cream/70 text-sm">
              <AtSign size={14} className="text-terra shrink-0" />
              <span>@intuiryoga</span>
            </div>
            <div className="flex items-center gap-2 text-cream/70 text-sm">
              <MapPin size={14} className="text-terra shrink-0" />
              <span>Campinas, SP</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-plum-light py-4 text-center text-cream/40 text-xs">
        © {new Date().getFullYear()} NovaIris. Todos os direitos reservados.
      </div>
    </footer>
  )
}
