import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AulaCard from '@/components/AulaCard'
import { createServiceClient } from '@/lib/supabase-server'
import { Calendar } from 'lucide-react'

export const revalidate = 60

export default async function AulasPage() {
  const supabase = createServiceClient()

  // A aula fica à venda desde que é postada e SOME um dia antes do evento.
  // Ex.: evento no dia 25 → deixa de aparecer no dia 24.
  // Mostramos apenas aulas cuja data seja maior que amanhã (data > hoje + 1 dia).
  const amanha = new Date()
  amanha.setDate(amanha.getDate() + 1)
  const limite = amanha.toISOString().split('T')[0]

  const { data: aulas, error } = await supabase
    .from('aulas')
    .select('*')
    .eq('ativa', true)
    .gt('data', limite)
    .order('data', { ascending: true })
    .order('horario', { ascending: true })

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      {/* Header */}
      <section className="bg-sage py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-terra/20 border border-terra/30 px-4 py-1.5 rounded-full mb-4">
            <Calendar size={16} className="text-terra-dark" />
            <span className="text-sm font-medium text-plum">Agenda de Eventos</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-plum">Eventos Disponíveis</h1>
          <p className="text-plum/70 max-w-lg mx-auto">
            Escolha a experiência que melhor se encaixa na sua rotina e reserve sua vaga agora mesmo.
          </p>
        </div>
      </section>

      {/* Aulas */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 mb-6">
            Erro ao carregar eventos. Tente novamente mais tarde.
          </div>
        )}

        {!error && aulas && aulas.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-sage-light rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={32} className="text-sage-dark" />
            </div>
            <h3 className="text-xl font-semibold text-plum mb-2">Nenhum evento disponível</h3>
            <p className="text-muted">
              No momento não há eventos agendados. Volte em breve ou entre em contato!
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
