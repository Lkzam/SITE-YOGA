import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { CheckCircle, Home, Calendar } from 'lucide-react'

export default function ConfirmacaoPage() {
  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      <section className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-sage p-8">
          <div className="w-20 h-20 bg-terra-light rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-terra" />
          </div>

          <h1 className="text-2xl font-bold text-plum mb-3">Reserva Confirmada!</h1>
          <p className="text-muted mb-2">
            Seu pagamento foi processado com sucesso. Sua vaga está garantida!
          </p>
          <p className="text-muted mb-8">
            Você receberá um e-mail de confirmação em breve com todos os detalhes do evento.
          </p>

          <div className="bg-sage-light rounded-xl p-4 mb-8 border border-sage">
            <p className="text-plum text-sm font-medium">
              Lembre-se de chegar 10 minutos antes e trazer seu próprio tapete, se possível.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="inline-flex items-center gap-2 justify-center border-2 border-plum text-plum hover:bg-cream font-semibold py-3 px-6 rounded-xl transition-all">
              <Home size={16} /> Página Inicial
            </Link>
            <Link href="/aulas" className="btn-primary inline-flex items-center gap-2 justify-center">
              <Calendar size={16} /> Ver Mais Eventos
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
