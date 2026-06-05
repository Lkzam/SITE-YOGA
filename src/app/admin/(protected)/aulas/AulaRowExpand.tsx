'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Loader2, Users, Mail, Phone, BadgeCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import AulaAdminActions from './AulaAdminActions'
import Link from 'next/link'

interface Aula {
  id: string
  titulo: string
  descricao?: string
  data: string
  horario: string
  localizacao: string
  vagas_disponiveis: number
  vagas_total: number
  preco: number
  ativa: boolean
  prevenda?: boolean
  prevenda_token?: string
}

interface Reserva {
  id: string
  cliente_nome: string
  cliente_email: string
  cliente_telefone: string
  valor_pago: number
  created_at: string
}

export default function AulaRowExpand({ aula }: { aula: Aula }) {
  const [expandido, setExpandido] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [reservas, setReservas] = useState<Reserva[] | null>(null)

  async function toggleExpand() {
    if (!expandido && reservas === null) {
      setCarregando(true)
      const supabase = createClient()
      const { data } = await supabase
        .from('reservas')
        .select('id, cliente_nome, cliente_email, cliente_telefone, valor_pago, created_at')
        .eq('aula_id', aula.id)
        .eq('status', 'pago')
        .order('created_at', { ascending: true })
      setReservas(data || [])
      setCarregando(false)
    }
    setExpandido(prev => !prev)
  }

  const vagasOcupadas = aula.vagas_total - aula.vagas_disponiveis

  return (
    <>
      {/* Linha principal da aula */}
      <tr className={`border-b border-gray-50 transition-colors ${expandido ? 'bg-sage/10' : 'hover:bg-gray-50/50'}`}>
        {/* Título com botão de expansão */}
        <td className="px-6 py-4">
          <button
            onClick={toggleExpand}
            className="flex items-center gap-2 text-left w-full group"
            title={expandido ? 'Recolher alunos' : 'Ver alunos inscritos'}
          >
            <span className="shrink-0 transition-transform">
              {carregando ? (
                <Loader2 size={15} className="animate-spin text-gray-400" />
              ) : expandido ? (
                <ChevronDown size={15} className="text-terra" />
              ) : (
                <ChevronRight size={15} className="text-gray-300 group-hover:text-terra transition-colors" />
              )}
            </span>
            <div>
              <p className="font-medium text-gray-800 text-sm">{aula.titulo}</p>
              {aula.descricao && (
                <p className="text-gray-400 text-xs truncate max-w-48">{aula.descricao}</p>
              )}
            </div>
          </button>
        </td>

        <td className="px-6 py-4">
          <p className="text-sm text-gray-700">{aula.data}</p>
          <p className="text-xs text-gray-400">{aula.horario.slice(0, 5)}</p>
        </td>

        <td className="px-6 py-4">
          <p className="text-sm text-gray-700 max-w-32 truncate">{aula.localizacao}</p>
        </td>

        <td className="px-6 py-4">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            aula.vagas_disponiveis === 0
              ? 'bg-red-100 text-red-600'
              : aula.vagas_disponiveis <= 3
              ? 'bg-orange-100 text-orange-600'
              : 'bg-green-100 text-green-600'
          }`}>
            {aula.vagas_disponiveis}/{aula.vagas_total}
          </span>
        </td>

        <td className="px-6 py-4">
          <p className="text-sm font-semibold text-green-700">
            R$ {aula.preco.toFixed(2).replace('.', ',')}
          </p>
        </td>

        <td className="px-6 py-4">
          <div className="flex flex-col gap-1">
            <span className={`text-xs px-2 py-1 rounded-full font-medium w-fit ${
              aula.ativa ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
            }`}>
              {aula.ativa ? 'Ativa' : 'Inativa'}
            </span>
            {aula.prevenda && aula.prevenda_token && (
              <span className="text-xs px-2 py-1 rounded-full font-medium bg-orange-100 text-orange-600 font-mono w-fit">
                🔑 {aula.prevenda_token}
              </span>
            )}
          </div>
        </td>

        <td className="px-6 py-4">
          <AulaAdminActions aulaId={aula.id} ativa={aula.ativa} />
        </td>
      </tr>

      {/* Painel de alunos expandido */}
      {expandido && (
        <tr className="bg-sage/5 border-b border-sage/30">
          <td colSpan={7} className="px-6 py-4">
            <div className="rounded-xl border border-sage overflow-hidden">
              {/* Cabeçalho do painel */}
              <div className="bg-sage/20 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Users size={15} className="text-terra" />
                  Alunos confirmados e pagos
                </div>
                <span className="text-xs bg-white border border-sage text-gray-600 px-2 py-0.5 rounded-full font-medium">
                  {reservas ? reservas.length : '...'} de {vagasOcupadas} inscritos
                </span>
              </div>

              {/* Lista de alunos */}
              {carregando ? (
                <div className="flex items-center justify-center gap-2 py-6 text-gray-400 text-sm">
                  <Loader2 size={16} className="animate-spin" />
                  Carregando...
                </div>
              ) : reservas && reservas.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-sage/30 bg-white">
                      <th className="text-left text-xs font-semibold text-gray-400 uppercase px-4 py-2.5">#</th>
                      <th className="text-left text-xs font-semibold text-gray-400 uppercase px-4 py-2.5">Nome</th>
                      <th className="text-left text-xs font-semibold text-gray-400 uppercase px-4 py-2.5">
                        <span className="flex items-center gap-1"><Mail size={11} /> E-mail</span>
                      </th>
                      <th className="text-left text-xs font-semibold text-gray-400 uppercase px-4 py-2.5">
                        <span className="flex items-center gap-1"><Phone size={11} /> Telefone</span>
                      </th>
                      <th className="text-left text-xs font-semibold text-gray-400 uppercase px-4 py-2.5">Valor pago</th>
                      <th className="text-left text-xs font-semibold text-gray-400 uppercase px-4 py-2.5">Data inscrição</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservas.map((r, i) => (
                      <tr key={r.id} className="border-b border-sage/20 last:border-0 hover:bg-white/60 transition-colors">
                        <td className="px-4 py-3 text-xs text-gray-400">{i + 1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <BadgeCheck size={13} className="text-green-500 shrink-0" />
                            <span className="text-sm font-medium text-gray-800">{r.cliente_nome}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{r.cliente_email}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{r.cliente_telefone}</td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-semibold text-green-700">
                            R$ {(r.valor_pago ?? 0).toFixed(2).replace('.', ',')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-400">
                          {new Date(r.created_at).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex items-center justify-center gap-2 py-6 text-gray-400 text-sm">
                  <Users size={16} />
                  Nenhum aluno confirmado ainda
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
