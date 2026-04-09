'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { LayoutDashboard, Calendar, PlusCircle, LogOut, Leaf, ExternalLink } from 'lucide-react'

const links = [
  { href: '/admin', label: 'Dashboard', icone: LayoutDashboard },
  { href: '/admin/aulas', label: 'Aulas', icone: Calendar },
  { href: '/admin/aulas/nova', label: 'Nova Aula', icone: PlusCircle },
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
    <aside className="w-64 bg-green-900 text-white flex flex-col min-h-screen">
      <div className="p-6 border-b border-green-800">
        <div className="flex items-center gap-2">
          <Leaf className="w-6 h-6 text-green-300" />
          <div>
            <p className="font-bold text-white text-sm">Yoga com Ana</p>
            <p className="text-green-400 text-xs">Painel Admin</p>
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
                  ? 'bg-green-700 text-white'
                  : 'text-green-300 hover:bg-green-800 hover:text-white'
              }`}
            >
              <Icone size={18} />
              {label}
            </Link>
          )
        })}

        <div className="mt-4 pt-4 border-t border-green-800">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-green-300 hover:bg-green-800 hover:text-white transition-all"
          >
            <ExternalLink size={18} />
            Ver Site
          </Link>
        </div>
      </nav>

      <div className="p-4 border-t border-green-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-green-300 hover:bg-red-900/50 hover:text-red-300 transition-all w-full"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </aside>
  )
}
