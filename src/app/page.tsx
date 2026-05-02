import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Heart, Star, Users, Award, ChevronRight, Wind, Sunrise, Moon } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-green-800 via-green-700 to-green-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-green-300 blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-32 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block bg-green-500/30 text-green-100 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              Bem-vindo ao seu espaço de paz
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Encontre seu <br />
              <span className="text-green-200">equilíbrio</span> com <br />
              o Yoga
            </h1>
            <p className="text-green-100 text-lg mb-8 max-w-md leading-relaxed">
              Aulas presenciais de yoga para todos os níveis. Respire, mova-se e
              reconecte-se consigo mesmo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/aulas" className="bg-white text-green-800 hover:bg-green-50 font-bold py-3 px-8 rounded-xl transition-all shadow-lg">
                Ver Aulas Disponíveis
              </Link>
              <Link href="#sobre" className="border-2 border-white/50 text-white hover:bg-white/10 font-semibold py-3 px-8 rounded-xl transition-all">
                Conhecer a Professora
              </Link>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="w-72 h-72 md:w-96 md:h-96 rounded-full bg-green-500/20 border-4 border-green-300/30 flex items-center justify-center backdrop-blur-sm">
              <div className="w-56 h-56 md:w-72 md:h-72 rounded-full bg-green-400/20 border-2 border-green-200/20 flex items-center justify-center">
                <span className="text-8xl">🧘</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-green-100">
        <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { valor: '500+', label: 'Alunos formados', icone: <Users size={20} /> },
            { valor: '8 anos', label: 'De experiência', icone: <Award size={20} /> },
            { valor: '4.9★', label: 'Avaliação média', icone: <Star size={20} /> },
            { valor: '100%', label: 'Dedicação', icone: <Heart size={20} /> },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                {stat.icone}
              </div>
              <span className="text-2xl font-bold text-green-800">{stat.valor}</span>
              <span className="text-gray-500 text-sm">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Sobre */}
      <section id="sobre" className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-72 h-72 md:w-80 md:h-80 rounded-3xl bg-gradient-to-br from-green-200 to-green-400 flex items-center justify-center">
                <span className="text-9xl">👩</span>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg p-4 border border-green-100">
                <p className="text-green-800 font-bold text-sm">Certificada RYT-500</p>
                <p className="text-gray-400 text-xs">Yoga Alliance</p>
              </div>
            </div>
          </div>

          <div>
            <span className="text-green-600 font-semibold text-sm uppercase tracking-widest">Sobre a Professora</span>
            <h2 className="text-3xl md:text-4xl font-bold text-green-900 mt-2 mb-6">
              Ana — Sua guia na jornada do yoga
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Com mais de 8 anos de prática e ensino, Ana se especializou em transformar
              a vida de seus alunos através do yoga. Formada em Hatha Yoga, Vinyasa e
              Yoga Restaurativa, ela adapta cada aula às necessidades individuais.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Ana acredita que o yoga é para todos — independente da idade, flexibilidade
              ou condicionamento físico. Seu método combina movimento, respiração e
              meditação para promover bem-estar integral.
            </p>
            <div className="flex flex-wrap gap-3">
              {['Hatha Yoga', 'Vinyasa Flow', 'Yoga Restaurativa', 'Meditação', 'Pranayama'].map((cert) => (
                <span key={cert} className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-medium">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modalidades */}
      <section id="aulas-info" className="bg-green-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-green-600 font-semibold text-sm uppercase tracking-widest">Modalidades</span>
            <h2 className="text-3xl md:text-4xl font-bold text-green-900 mt-2">O que oferecemos</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icone: <Sunrise className="w-8 h-8 text-green-600" />,
                titulo: 'Hatha Yoga',
                desc: 'Posturas clássicas com foco em alinhamento, respiração e equilíbrio. Ideal para iniciantes e praticantes de todos os níveis.',
                cor: 'from-yellow-50 to-green-50',
              },
              {
                icone: <Wind className="w-8 h-8 text-green-600" />,
                titulo: 'Vinyasa Flow',
                desc: 'Sequências dinâmicas sincronizadas com a respiração. Desenvolve força, flexibilidade e concentração.',
                cor: 'from-green-50 to-teal-50',
              },
              {
                icone: <Moon className="w-8 h-8 text-green-600" />,
                titulo: 'Yoga Restaurativa',
                desc: 'Prática suave com suportes para relaxamento profundo. Perfeita para aliviar o estresse e restaurar a energia.',
                cor: 'from-blue-50 to-green-50',
              },
            ].map((mod) => (
              <div key={mod.titulo} className={`bg-gradient-to-br ${mod.cor} rounded-2xl p-6 border border-green-100`}>
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                  {mod.icone}
                </div>
                <h3 className="text-lg font-bold text-green-900 mb-2">{mod.titulo}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{mod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <span className="text-green-600 font-semibold text-sm uppercase tracking-widest">Depoimentos</span>
          <h2 className="text-3xl font-bold text-green-900 mt-2">O que dizem nossos alunos</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { nome: 'Maria S.', texto: 'As aulas da Ana mudaram minha vida! Em 3 meses já sinto muito mais flexibilidade e paz interior.', estrelas: 5 },
            { nome: 'João P.', texto: 'Nunca imaginei que ia me apaixonar pelo yoga. A Ana tem um jeito único de ensinar que faz tudo parecer natural.', estrelas: 5 },
            { nome: 'Carla M.', texto: 'A yoga restaurativa foi essencial para minha recuperação. Ambiente acolhedor e professora incrível!', estrelas: 5 },
          ].map((dep) => (
            <div key={dep.nome} className="card">
              <div className="flex gap-1 mb-3">
                {Array(dep.estrelas).fill(0).map((_, i) => (
                  <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">&ldquo;{dep.texto}&rdquo;</p>
              <p className="text-green-800 font-semibold text-sm">— {dep.nome}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-green-700 to-green-600 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Pronta para começar sua jornada?</h2>
          <p className="text-green-100 mb-8">Reserve sua vaga em uma de nossas aulas e dê o primeiro passo rumo ao equilíbrio.</p>
          <Link href="/aulas" className="inline-flex items-center gap-2 bg-white text-green-800 font-bold py-3 px-8 rounded-xl hover:bg-green-50 transition-all shadow-lg">
            Ver Aulas Disponíveis <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
