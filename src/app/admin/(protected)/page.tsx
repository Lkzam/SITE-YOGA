import { createClient } from '@/lib/supabase-server'
import { Calendar, Users, DollarSign, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const hoje = new Date().toISOString().split('T')[0]

  const [
    { count: totalAulas },
    { count: aulasHoje },
    { count: totalReservas },
    { data: reservasPagas },
  ] = await Promise.all([
    supabase.from('aulas').select('*', { count: 'exact', head: true }).eq('ativa', true).gte('data', hoje),
    supabase.from('aulas').select('*', { count: 'exact', head: true }).eq('data', hoje),
    supabase.from('reservas').select('*', { count: 'exact', head: true }).eq('status', 'pago'),
    supabase.from('reservas').select('valor_pago').eq('status', 'pago'),
  ])

  const totalRecebido = reservasPagas?.reduce((acc, r) => acc + (r.valor_pago || 0), 0) || 0

  const { data: proximasAulas } = await supabase
    .from('aulas')
    .select('*')
    .eq('ativa', true)
    .gte('data', hoje)
    .order('data', { ascending: true })
    .limit(5)

  const { data: ultimasReservas } = await supabase
    .from('reservas')
    .select('*, aulas(titulo, data)')
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = [
    { label: 'Aulas Futuras', valor: totalAulas || 0, icone: Calendar, cor: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Aulas Hoje', valor: aulasHoje || 0, icone: TrendingUp, cor: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Reservas Pagas', valor: totalReservas || 0, icone: Users, cor: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Total Recebido', valor: `R$ ${totalRecebido.toFixed(2).replace('.', ',')}`, icone: DollarSign, cor: 'text-emerald-600', bg: 'bg-emerald-100' },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm">Visão geral do seu estúdio</p>
        </div>
        <Link href="/admin/aulas/nova" className="btn-admin text-sm">
          + Nova Aula
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icone size={20} className={stat.cor} />
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.valor}</p>
            <p className="text-gray-500 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-800">Próximas Aulas</h2>
            <Link href="/admin/aulas" className="text-green-600 text-sm hover:text-green-800">Ver todas</Link>
          </div>
          {proximasAulas && proximasAulas.length > 0 ? (
            <div className="flex flex-col gap-3">
              {proximasAulas.map((aula) => (
                <div key={aula.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{aula.titulo}</p>
                    <p className="text-xs text-gray-400">{aula.data} às {aula.horario.slice(0, 5)}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    aula.vagas_disponiveis === 0 ? 'bg-red-100 text-red-600'
                    : aula.vagas_disponiveis <= 3 ? 'bg-orange-100 text-orange-600'
                    : 'bg-green-100 text-green-600'
                  }`}>
                    {aula.vagas_disponiveis}/{aula.vagas_total} vagas
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Nenhuma aula agendada.</p>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-800 mb-4">Últimas Reservas</h2>
          {ultimasReservas && ultimasReservas.length > 0 ? (
            <div className="flex flex-col gap-3">
              {ultimasReservas.map((reserva: { id: string; cliente_nome: string; status: string; valor_pago: number; aulas?: { titulo: string } }) => (
                <div key={reserva.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{reserva.cliente_nome}</p>
                    <p className="text-xs text-gray-400">{reserva.aulas?.titulo}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    reserva.status === 'pago' ? 'bg-green-100 text-green-600'
                    : reserva.status === 'cancelado' ? 'bg-red-100 text-red-600'
                    : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {reserva.status === 'pago' ? 'Pago' : reserva.status === 'cancelado' ? 'Cancelado' : 'Pendente'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Nenhuma reserva ainda.</p>
          )}
        </div>
      </div>
    </div>
  )
}
