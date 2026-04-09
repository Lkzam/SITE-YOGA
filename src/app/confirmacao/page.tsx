import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { CheckCircle, Home, Calendar } from 'lucide-react'

export default function ConfirmacaoPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="card">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-green-900 mb-3">Reserva Confirmada!</h1>
          <p className="text-gray-500 mb-2">
            Seu pagamento foi processado com sucesso. Sua vaga está garantida!
          </p>
          <p className="text-gray-500 mb-8">
            Você receberá um e-mail de confirmação em breve com todos os detalhes da aula.
          </p>

          <div className="bg-green-50 rounded-xl p-4 mb-8 border border-green-100">
            <p className="text-green-800 text-sm font-medium">
              Lembre-se de chegar 10 minutos antes da aula e trazer seu próprio tapete, se possível.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn-secondary inline-flex items-center gap-2 justify-center">
              <Home size={16} /> Página Inicial
            </Link>
            <Link href="/aulas" className="btn-primary inline-flex items-center gap-2 justify-center">
              <Calendar size={16} /> Ver Mais Aulas
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
