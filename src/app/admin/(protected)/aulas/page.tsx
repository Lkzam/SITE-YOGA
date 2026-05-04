import { createServiceClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { PlusCircle, Calendar } from 'lucide-react'
import AulaAdminActions from './AulaAdminActions'

export default async function AdminAulasPage() {
  const supabase = createServiceClient()

  const { data: aulas } = await supabase
    .from('aulas')
    .select('*')
    .order('data', { ascending: false })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gerenciar Aulas</h1>
          <p className="text-gray-500 text-sm">Todas as aulas cadastradas</p>
        </div>
        <Link href="/admin/aulas/nova" className="btn-primary text-sm">
          <span className="flex items-center gap-2"><PlusCircle size={16} /> Nova Aula</span>
        </Link>
      </div>

      {aulas && aulas.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Aula</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Data/Hora</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Local</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Vagas</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Preço</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {aulas.map((aula) => (
                  <tr key={aula.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800 text-sm">{aula.titulo}</p>
                      {aula.descricao && (
                        <p className="text-gray-400 text-xs truncate max-w-48">{aula.descricao}</p>
                      )}
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
                        aula.vagas_disponiveis === 0 ? 'bg-red-100 text-red-600'
                        : aula.vagas_disponiveis <= 3 ? 'bg-orange-100 text-orange-600'
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Calendar size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">Nenhuma aula cadastrada ainda.</p>
          <Link href="/admin/aulas/nova" className="btn-primary text-sm inline-block">
            Criar primeira aula
          </Link>
        </div>
      )}
    </div>
  )
}
