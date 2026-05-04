import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Heart, Star, Users, ChevronRight, Wind, Sunrise, Moon } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-plum text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-terra blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-sage blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-32 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block bg-terra/20 text-terra-light border border-terra/30 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              Bem-vindo ao seu espaço de paz
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-white">
              Experiências de yoga para{' '}
              <span className="text-terra">transformar</span>{' '}
              seu dia
            </h1>
            <p className="text-cream/80 text-lg mb-8 max-w-md leading-relaxed">
              Mais do que uma aula, um convite para pausar, respirar e se reconectar.
              Práticas acessíveis, em cenários inspiradores, para todos os níveis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/aulas" className="bg-terra hover:bg-terra-hover text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
                Ver eventos disponíveis <ChevronRight size={18} />
              </Link>
              <Link href="#sobre" className="border-2 border-cream/30 text-cream hover:bg-white/10 font-semibold py-3 px-8 rounded-xl transition-all text-center">
                Conhecer a Professora
              </Link>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="w-72 h-72 md:w-96 md:h-96 rounded-full bg-terra/10 border-4 border-terra/20 flex items-center justify-center backdrop-blur-sm">
              <div className="w-56 h-56 md:w-72 md:h-72 rounded-full bg-sage/10 border-2 border-sage/20 flex items-center justify-center">
                <span className="text-8xl">🧘</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-sage">
        <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { valor: '500+', label: 'pessoas já se reconectaram através do yoga', icone: <Users size={20} /> },
            { valor: '10 anos+', label: 'de conexão com o yoga', icone: <Heart size={20} /> },
            { valor: '4.9★', label: 'Avaliação média', icone: <Star size={20} /> },
            { valor: '100%', label: 'Dedicação e presença', icone: <Wind size={20} /> },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-terra-light flex items-center justify-center text-terra">
                {stat.icone}
              </div>
              <span className="text-2xl font-bold text-plum">{stat.valor}</span>
              <span className="text-muted text-sm leading-snug">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Sobre */}
      <section id="sobre" className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="flex justify-center md:sticky md:top-24">
            <div className="relative">
              <div className="w-72 h-72 md:w-80 md:h-80 rounded-3xl bg-gradient-to-br from-sage to-sage-dark flex items-center justify-center">
                <span className="text-9xl">👩</span>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg p-4 border border-sage">
                <p className="text-plum font-bold text-sm">Millena Bonomi</p>
                <p className="text-muted text-xs">Instrutora de Yoga</p>
              </div>
            </div>
          </div>

          <div>
            <span className="text-terra font-semibold text-sm uppercase tracking-widest">Sobre a Professora</span>
            <h2 className="text-3xl md:text-4xl font-bold text-plum mt-2 mb-6">
              Millena Bonomi
            </h2>

            <div className="flex flex-col gap-4 text-gray-600 leading-relaxed text-sm">
              <p>
                Meu nome é Millena Bonomi, tenho 46 anos e pratico yoga desde 2004.
                Ao longo dessa trajetória, me formei em Hatha Yoga, Vinyasa Yoga e Yin Yoga,
                além de diversas especializações que sustentam uma prática segura, consciente
                e adaptável a diferentes corpos e momentos de vida.
              </p>
              <p>
                Minha jornada pessoal, incluindo o enfrentamento do câncer de mama,
                transformou profundamente a forma como ensino. Hoje, conduzo práticas que
                vão além do movimento: são experiências de escuta, presença e reconexão.
              </p>
              <p>
                Acredito que o yoga precisa ser acessível, possível e real. Por isso,
                meu trabalho é voltado especialmente para pessoas que buscam:
              </p>
              <ul className="flex flex-col gap-1.5 pl-2">
                {[
                  'Reduzir o estresse e ansiedade',
                  'Reconectar-se com o próprio corpo',
                  'Respeitar seus limites sem abrir mão do cuidado',
                  'Criar uma rotina de autocuidado sustentável',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-terra mt-0.5 shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p>
                No Intuir Yoga, você encontra práticas que respeitam o seu tempo, o seu
                corpo e a sua história — seja você iniciante, praticante ou alguém
                atravessando um momento desafiador.
              </p>
              <p className="text-plum font-medium italic">
                &ldquo;Se o yoga foi uma ferramenta essencial na minha jornada de cura e
                reconstrução, hoje ele se torna também o caminho que compartilho para apoiar
                outras pessoas em seus próprios processos.&rdquo;
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              {['Hatha Yoga', 'Vinyasa Yoga', 'Yin Yoga', 'Meditação', 'Pranayama'].map((cert) => (
                <span key={cert} className="bg-sage-light text-plum text-sm px-3 py-1 rounded-full font-medium border border-sage">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experiências */}
      <section id="aulas-info" className="bg-cream-dark py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-4">
            <span className="text-terra font-semibold text-sm uppercase tracking-widest">Modalidades</span>
            <h2 className="text-3xl md:text-4xl font-bold text-plum mt-2 mb-4">
              Experiências de Yoga na Natureza
            </h2>
          </div>

          {/* Texto introdutório */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-gray-600 leading-relaxed mb-4">
              Mais do que uma prática, são experiências. Crio encontros que unem yoga,
              natureza e presença para quem sente a necessidade de pausar, respirar e se reconectar.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              São vivências pensadas para desacelerar o ritmo, sair do automático e voltar
              para o corpo. Em meio ao verde, ao silêncio e aos ciclos naturais, o yoga
              ganha um novo significado.
            </p>
            <p className="text-plum font-medium italic">
              Você não precisa ter experiência. Precisa apenas estar disposto a sentir.
            </p>
          </div>

          {/* O que esperar */}
          <div className="bg-white rounded-2xl border border-sage p-6 mb-12 max-w-2xl mx-auto">
            <p className="text-plum font-semibold mb-3 text-center">Durante os encontros, você pode esperar:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'Práticas acessíveis e acolhedoras',
                'Conexão com a respiração e com o corpo',
                'Momentos de contemplação e silêncio',
                'Trocas leves e verdadeiras',
                'Experiências que nutrem de dentro para fora',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-terra mt-0.5 shrink-0">✦</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3 Experiências */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icone: <Sunrise className="w-8 h-8 text-terra" />,
                titulo: 'CALMARIA',
                cor: 'from-terra-light to-cream',
                desc: 'Uma experiência de yoga para desacelerar e se reconectar, realizada na Padoca do Vila, em Joaquim Egídio, sob a sombra de um frondoso jatobá.',
              },
              {
                icone: <Wind className="w-8 h-8 text-terra" />,
                titulo: 'AmaheSer',
                cor: 'from-sage-light to-cream',
                desc: 'Um evento de yoga ao nascer do sol, realizado no ponto mais alto do Pico das Cabras, em Joaquim Egídio. Uma experiência que une yoga, meditação e relaxamento para despertar o corpo com suavidade enquanto o dia nasce.',
              },
              {
                icone: <Moon className="w-8 h-8 text-terra" />,
                titulo: 'EntardeSer',
                cor: 'from-plum-100 to-cream',
                desc: 'Um ritual de fim de dia. Um encontro com o yoga ao pôr do sol para se recolher, soltar o excesso e voltar para dentro com calma e presença.',
              },
            ].map((exp) => (
              <div key={exp.titulo} className={`bg-gradient-to-br ${exp.cor} rounded-2xl p-6 border border-sage hover:shadow-md transition-shadow`}>
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-sage">
                  {exp.icone}
                </div>
                <h3 className="text-lg font-bold text-plum mb-2">{exp.titulo}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{exp.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-500 text-sm mt-8 italic">
            Cada evento é único, mas todos têm o mesmo propósito: oferecer um espaço seguro para você se reconectar com você mesmo.
          </p>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <span className="text-terra font-semibold text-sm uppercase tracking-widest">Depoimentos</span>
          <h2 className="text-3xl font-bold text-plum mt-2">O que dizem nossos alunos</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { nome: 'Maria S.', texto: 'As aulas da Millena mudaram minha vida! Em 3 meses já sinto muito mais flexibilidade e paz interior.', estrelas: 5 },
            { nome: 'João P.', texto: 'Nunca imaginei que ia me apaixonar pelo yoga. A Millena tem um jeito único de ensinar que faz tudo parecer natural.', estrelas: 5 },
            { nome: 'Carla M.', texto: 'A experiência foi essencial para minha recuperação. Ambiente acolhedor e professora incrível!', estrelas: 5 },
          ].map((dep) => (
            <div key={dep.nome} className="bg-white rounded-2xl shadow-sm border border-sage p-6">
              <div className="flex gap-1 mb-3">
                {Array(dep.estrelas).fill(0).map((_, i) => (
                  <Star key={i} size={14} className="text-terra fill-terra" />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">&ldquo;{dep.texto}&rdquo;</p>
              <p className="text-plum font-semibold text-sm">— {dep.nome}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-plum py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronta para começar sua jornada?
          </h2>
          <p className="text-cream/70 mb-8 text-lg">
            Reserve sua vaga em um de nossos eventos e dê o primeiro passo rumo a mais presença e equilíbrio.
          </p>
          <Link
            href="/aulas"
            className="inline-flex items-center gap-2 bg-terra hover:bg-terra-hover text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg"
          >
            Ver eventos disponíveis <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
