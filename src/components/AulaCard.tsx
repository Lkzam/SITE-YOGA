import Link from 'next/link'
import { Calendar, Clock, MapPin, Users, Tag } from 'lucide-react'
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
}

export default function AulaCard({ aula }: { aula: Aula }) {
  const vagasEsgotadas = aula.vagas_disponiveis === 0
  const poucasVagas = aula.vagas_disponiveis <= 3 && aula.vagas_disponiveis > 0

  const dataFormatada = format(parseISO(aula.data), "EEEE, dd 'de' MMMM", { locale: ptBR })
  const horarioFormatado = aula.horario.slice(0, 5)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="h-2 bg-gradient-to-r from-green-500 to-green-700" />

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-green-900">{aula.titulo}</h3>
          <span className="text-xl font-bold text-green-700">
            R$ {aula.preco.toFixed(2).replace('.', ',')}
          </span>
        </div>

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
