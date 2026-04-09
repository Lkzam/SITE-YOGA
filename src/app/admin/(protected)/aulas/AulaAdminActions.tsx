'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { useState } from 'react'

export default function AulaAdminActions({ aulaId, ativa }: { aulaId: string; ativa: boolean }) {
  const router = useRouter()
  const [carregando, setCarregando] = useState(false)

  async function toggleAtiva() {
    setCarregando(true)
    const supabase = createClient()
    await supabase.from('aulas').update({ ativa: !ativa }).eq('id', aulaId)
    router.refresh()
    setCarregando(false)
  }

  async function excluir() {
    if (!confirm('Tem certeza que deseja excluir esta aula? Esta ação não pode ser desfeita.')) return
    setCarregando(true)
    const supabase = createClient()
    await supabase.from('aulas').delete().eq('id', aulaId)
    router.refresh()
    setCarregando(false)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleAtiva}
        disabled={carregando}
        className={`p-1.5 rounded-lg transition-colors ${
          ativa ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'
        }`}
        title={ativa ? 'Desativar' : 'Ativar'}
      >
        {ativa ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
      </button>
      <button
        onClick={excluir}
        disabled={carregando}
        className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
        title="Excluir"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}
