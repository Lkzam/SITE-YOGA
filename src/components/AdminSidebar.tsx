'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { LayoutDashboard, Calendar, PlusCircle, LogOut, ExternalLink } from 'lucide-react'

const links = [
  { href: '/admin', label: 'Dashboard', icone: LayoutDashboard },
  { href: '/admin/aulas', label: 'Eventos', icone: Calendar },
  { href: '/admin/aulas/nova', label: 'Novo Evento', icone: PlusCircle },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="w-64 bg-sage text-plum flex flex-col min-h-screen">
      <div className="p-6 border-b border-sage-dark">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="Intuir Yoga" className="w-7 h-7" />
          <div>
            <p className="font-bold text-plum text-sm">Intuir Yoga</p>
            <p className="text-plum/50 text-xs">Painel Admin</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-1">
        {links.map(({ href, label, icone: Icone }) => {
          const ativo = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                ativo
                  ? 'bg-terra text-white'
                  : 'text-plum/70 hover:bg-sage-dark hover:text-plum'
              }`}
            >
              <Icone size={18} />
              {label}
            </Link>
          )
        })}

        <div className="mt-4 pt-4 border-t border-sage-dark">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-plum/70 hover:bg-sage-dark hover:text-plum transition-all"
          >
            <ExternalLink size={18} />
            Ver Site
          </Link>
        </div>
      </nav>

      <div className="p-4 border-t border-sage-dark">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-plum/70 hover:bg-red-100 hover:text-red-600 transition-all w-full"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </aside>
  )
}
