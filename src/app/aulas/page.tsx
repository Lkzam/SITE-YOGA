import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AulaCard from '@/components/AulaCard'
import { createClient } from '@/lib/supabase-server'
import { Calendar } from 'lucide-react'

export const revalidate = 60

export default async function AulasPage() {
  const supabase = await createClient()

  const hoje = new Date().toISOString().split('T')[0]

  const { data: aulas, error } = await supabase
    .from('aulas')
    .select('*')
    .eq('ativa', true)
    .gte('data', hoje)
    .order('data', { ascending: true })
    .order('horario', { ascending: true })

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-br from-green-700 to-green-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/30 px-4 py-1.5 rounded-full mb-4">
            <Calendar size={16} />
            <span className="text-sm font-medium">Agenda de Aulas</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Aulas Disponíveis</h1>
          <p className="text-green-100 max-w-lg mx-auto">
            Escolha a aula que melhor se encaixa na sua rotina e reserve sua vaga agora mesmo.
          </p>
        </div>
      </section>

      {/* Aulas */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 mb-6">
            Erro ao carregar aulas. Tente novamente mais tarde.
          </div>
        )}

        {!error && aulas && aulas.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={32} className="text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">Nenhuma aula disponível</h3>
            <p className="text-gray-500">
              No momento não há aulas agendadas. Volte em breve ou entre em contato!
            </p>
          </div>
        )}

        {aulas && aulas.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aulas.map((aula) => (
              <AulaCard key={aula.id} aula={aula} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}
