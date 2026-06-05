import { createServiceClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { PlusCircle, Calendar } from 'lucide-react'
import AulaRowExpand from './AulaRowExpand'

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
          <p className="text-gray-500 text-sm">Clique em uma aula para ver os alunos inscritos</p>
        </div>
        <Link href="/admin/aulas/nova" className="btn-admin text-sm">
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
                  <AulaRowExpand key={aula.id} aula={aula} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Calendar size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">Nenhuma aula cadastrada ainda.</p>
          <Link href="/admin/aulas/nova" className="btn-admin text-sm inline-block">
            Criar primeira aula
          </Link>
        </div>
      )}
    </div>
  )
}
