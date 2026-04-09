import { Leaf, AtSign, Phone, Mail, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-green-900 text-green-100">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="w-5 h-5 text-green-300" />
            <span className="text-lg font-bold text-white">Yoga com Ana</span>
          </div>
          <p className="text-green-300 text-sm leading-relaxed">
            Encontre equilíbrio, paz e bem-estar através da prática do yoga.
            Aulas para todos os níveis, do iniciante ao avançado.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Links Rápidos</h3>
          <div className="flex flex-col gap-2">
            <Link href="/" className="text-green-300 hover:text-white text-sm transition-colors">Início</Link>
            <Link href="/#sobre" className="text-green-300 hover:text-white text-sm transition-colors">Sobre Ana</Link>
            <Link href="/aulas" className="text-green-300 hover:text-white text-sm transition-colors">Agendar Aula</Link>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Contato</h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-green-300 text-sm">
              <Phone size={14} />
              <span>(11) 99999-9999</span>
            </div>
            <div className="flex items-center gap-2 text-green-300 text-sm">
              <Mail size={14} />
              <span>ana@yogacomana.com.br</span>
            </div>
            <div className="flex items-center gap-2 text-green-300 text-sm">
              <AtSign size={14} />
              <span>@yogacomana</span>
            </div>
            <div className="flex items-center gap-2 text-green-300 text-sm">
              <MapPin size={14} />
              <span>São Paulo, SP</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-green-800 py-4 text-center text-green-500 text-xs">
        © {new Date().getFullYear()} Yoga com Ana. Todos os direitos reservados.
      </div>
    </footer>
  )
}
