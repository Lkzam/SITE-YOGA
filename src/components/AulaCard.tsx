import Link from 'next/link'
import { Calendar, Clock, MapPin, Users, Lock } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Aula {
  id: string
  titulo: string
  descricao: string
  data: string
  horario: string
  localizacao: string
  vagas_total: number
  vagas_disponiveis: number
  preco: number
  prevenda?: boolean
  prevenda_inicio?: string
  prevenda_fim?: string
  prevenda_preco?: number
}

export default function AulaCard({ aula }: { aula: Aula }) {
  const vagasEsgotadas = aula.vagas_disponiveis === 0
  const poucasVagas = aula.vagas_disponiveis <= 3 && aula.vagas_disponiveis > 0

  const dataFormatada = format(parseISO(aula.data), "EEEE, dd 'de' MMMM", { locale: ptBR })
  const horarioFormatado = aula.horario.slice(0, 5)

  // Detecta se está em pré-venda
  const hoje = new Date().toISOString().split('T')[0]
  const emPrevenda = !!(
    aula.prevenda &&
    aula.prevenda_inicio &&
    aula.prevenda_fim &&
    aula.prevenda_inicio <= hoje &&
    hoje <= aula.prevenda_fim
  )

  const precoExibido = emPrevenda && aula.prevenda_preco ? aula.prevenda_preco : aula.preco

  return (
    <div className={`bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 ${
      emPrevenda ? 'border-2 border-orange-300' : 'border border-green-100'
    }`}>
      <div className={`h-2 bg-gradient-to-r ${emPrevenda ? 'from-orange-400 to-orange-600' : 'from-green-500 to-green-700'}`} />

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-green-900 flex-1 mr-2">{aula.titulo}</h3>
          <div className="text-right shrink-0">
            {emPrevenda && aula.prevenda_preco ? (
              <div>
                <span className="text-xl font-bold text-orange-600">
                  R$ {aula.prevenda_preco.toFixed(2).replace('.', ',')}
                </span>
                <p className="text-xs text-gray-400 line-through">
                  R$ {aula.preco.toFixed(2).replace('.', ',')}
                </p>
              </div>
            ) : (
              <span className="text-xl font-bold text-green-700">
                R$ {aula.preco.toFixed(2).replace('.', ',')}
              </span>
            )}
          </div>
        </div>

        {/* Badge pré-venda */}
        {emPrevenda && (
          <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 text-xs font-semibold px-2.5 py-1 rounded-full mb-3">
            <Lock size={11} />
            PRÉ-VENDA — Acesso exclusivo com token
          </div>
        )}

        {aula.descricao && (
          <p className="text-gray-500 text-sm mb-4 leading-relaxed">{aula.descricao}</p>
        )}

        <div className="flex flex-col gap-2 mb-5">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={15} className="text-green-600 shrink-0" />
            <span className="capitalize">{dataFormatada}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={15} className="text-green-600 shrink-0" />
            <span>{horarioFormatado}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={15} className="text-green-600 shrink-0" />
            <span>{aula.localizacao}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users size={15} className="text-green-600 shrink-0" />
            <span>
              {vagasEsgotadas ? (
                <span className="text-red-500 font-medium">Vagas esgotadas</span>
              ) : poucasVagas ? (
                <span className="text-orange-500 font-medium">
                  Últimas {aula.vagas_disponiveis} vagas!
                </span>
              ) : (
                <span>{aula.vagas_disponiveis} vagas disponíveis</span>
              )}
            </span>
          </div>
        </div>

        {vagasEsgotadas ? (
          <button disabled className="w-full py-3 rounded-xl bg-gray-100 text-gray-400 font-semibold cursor-not-allowed">
            Esgotado
          </button>
        ) : emPrevenda ? (
          <Link
            href={`/reservar/${aula.id}`}
            className="flex items-center justify-center gap-2 w-full text-center py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors"
          >
            <Lock size={15} />
            Acessar Pré-venda — R$ {precoExibido.toFixed(2).replace('.', ',')}
          </Link>
        ) : (
          <Link
            href={`/reservar/${aula.id}`}
            className="block w-full text-center btn-primary"
          >
            Reservar Vaga — R$ {aula.preco.toFixed(2).replace('.', ',')}
          </Link>
        )}
      </div>
    </div>
  )
}
