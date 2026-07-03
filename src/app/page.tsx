import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroVideo from '@/components/HeroVideo'
import Link from 'next/link'
import { Heart, Star, Users, ChevronRight, Wind, Sunrise, Moon } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-sage">
        {/* Vídeo de fundo com loop ping-pong */}
        <HeroVideo />
        {/* Overlay para legibilidade do texto sobre o vídeo */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/65 via-black/40 to-black/20" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-24 md:py-32 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block bg-white/10 backdrop-blur-sm text-cream border border-white/25 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              Bem-vindo ao seu espaço de paz
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-white drop-shadow-lg">
              Experiências de yoga para{' '}
              <span className="text-terra">transformar</span>{' '}
              seu dia
            </h1>
            <p className="text-white/85 text-lg mb-8 max-w-md leading-relaxed drop-shadow">
              Mais do que uma aula, um convite para pausar, respirar e se reconectar.
              Práticas acessíveis, em cenários inspiradores, para todos os níveis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/aulas" className="bg-terra hover:bg-terra-hover text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
                Ver eventos disponíveis <ChevronRight size={18} />
              </Link>
              <Link href="#sobre" className="border-2 border-white/50 text-white hover:bg-white/10 font-semibold py-3 px-8 rounded-xl transition-all text-center backdrop-blur-sm">
                Conhecer a Professora
              </Link>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <img src="/logo.svg" alt="Intuir Yoga" className="w-72 h-72 md:w-[420px] md:h-[420px] drop-shadow-2xl" />
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
            <div className="w-72 h-72 md:w-80 md:h-80 rounded-3xl overflow-hidden">
              <img
                src="/millena-bonomi.jpg"
                alt="Millena Bonomi — Professora de Yoga"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div>
            <span className="text-terra font-semibold text-sm uppercase tracking-widest">Sobre a Professora</span>
            <h2 className="text-3xl md:text-4xl font-bold text-plum mt-2 mb-6">
              Millena Bonomi
            </h2>

            <div className="flex flex-col gap-4 text-gray-600 leading-relaxed text-sm">
              <p>
                Sou Millena Bonomi e encontrei no yoga muito mais do que uma prática —
                encontrei um caminho de reconexão comigo mesma.
              </p>
              <p>
                Pratico yoga desde 2004 e, ao longo desses anos, me formei em Hatha Yoga,
                Vinyasa Yoga e Yin Yoga, além de diversas especializações que sustentam uma
                condução segura, consciente e adaptável a diferentes corpos e momentos de vida.
              </p>
              <p>
                Mas foi a minha própria história que transformou profundamente a forma como ensino.
                Durante o enfrentamento do câncer de mama, o yoga deixou de ser apenas movimento
                e tornou-se acolhimento, presença, respiração e força nos dias mais difíceis.
                Foi através da prática que aprendi a respeitar meus limites sem perder a conexão
                com quem eu sou.
              </p>
              <p>
                Hoje, cada aula que conduzo carrega essa vivência real.
              </p>
              <p>
                Acredito que o yoga precisa ser acessível, humano e possível. Não sobre
                performance, mas sobre presença. Não sobre alcançar uma forma perfeita, mas
                sobre aprender a habitar o próprio corpo com mais gentileza.
              </p>
              <p>Por isso, meu trabalho é voltado especialmente para pessoas que desejam:</p>
              <ul className="flex flex-col gap-1.5 pl-2">
                {[
                  'Reduzir o estresse e a ansiedade',
                  'Reconectar-se com o próprio corpo',
                  'Respeitar seus limites sem abrir mão do autocuidado',
                  'Criar uma rotina mais leve, consciente e sustentável',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-terra mt-0.5 shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p>
                No Intuir Yoga, cada prática respeita o seu tempo, o seu corpo e a sua
                história — seja você iniciante, praticante ou alguém atravessando um momento
                desafiador da vida.
              </p>
              <p>
                Meu propósito é ampliar o acesso ao yoga de forma acolhedora e transformadora,
                criando experiências que vão além do tapete: experiências de escuta, respiração,
                presença e reconexão.
              </p>
              <p className="text-plum font-medium italic">
                &ldquo;Se o yoga foi parte essencial da minha jornada de cura e reconstrução,
                hoje ele se torna também o caminho que compartilho para apoiar outras pessoas
                em seus próprios processos.&rdquo;
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

      {/* Yoga na Natureza */}
      <section id="aulas-info" className="bg-cream-dark py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-4">
            <h2 className="text-3xl md:text-4xl font-bold text-plum mt-2 mb-4">
              Yoga na Natureza
            </h2>
          </div>

          {/* Texto introdutório */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="flex flex-col gap-4 text-gray-600 leading-relaxed text-sm text-left">
              <p>
                Mais do que aulas, são experiências de presença, conexão e reconexão consigo mesmo.
                Crio encontros que unem yoga, natureza e sensibilidade para pessoas que sentem a
                necessidade de pausar o ritmo acelerado da vida, respirar com mais consciência e
                voltar para dentro.
              </p>
              <p>
                São vivências pensadas para desacelerar, sair do automático e lembrar que o corpo
                também precisa de cuidado, silêncio e presença.
              </p>
              <p>
                Em meio ao verde, aos ciclos naturais e à simplicidade dos encontros verdadeiros,
                o yoga ganha um novo significado. Ele deixa de ser apenas prática e se transforma
                em experiência.
              </p>
              <p className="font-medium text-plum">
                Não é sobre performance.<br />
                Não é sobre flexibilidade.<br />
                É sobre sentir.
              </p>
              <p>
                Você não precisa ter experiência com yoga.<br />
                Precisa apenas permitir-se viver esse momento.
              </p>
              <p>Durante o encontro, você vai vivenciar:</p>
              <ul className="flex flex-col gap-1.5 pl-2">
                {[
                  'práticas acessíveis, acolhedoras e adaptáveis',
                  'conexão com a respiração e com o corpo',
                  'momentos de contemplação, silêncio e pausa',
                  'trocas leves, humanas e verdadeiras',
                  'experiências que nutrem de dentro para fora',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-terra mt-0.5 shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-plum font-medium italic">
                Cada evento é único, porque cada pessoa chega com sua própria história.
                Se você sente que precisa de mais presença, leveza e sentido na rotina,
                talvez esse encontro seja exatamente o convite que o seu corpo e a sua alma
                estavam esperando.
              </p>
            </div>
          </div>

          {/* Cards de Experiências */}
          <h3 className="text-2xl font-bold text-plum text-center mb-8">Experiências</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icone: <Sunrise className="w-8 h-8 text-terra" />,
                titulo: 'CALMARIA',
                cor: 'from-terra-light to-cream',
                desc: 'É uma experiência de yoga para desacelerar e se reconectar, realizada na Padoca do Vila, em Joaquim Egídio, sob a sombra de um frondoso jatobá.',
              },
              {
                icone: <Wind className="w-8 h-8 text-terra" />,
                titulo: 'AmaheSer',
                cor: 'from-sage-light to-cream',
                desc: 'É uma experiência de yoga ao nascer do sol, realizado no ponto mais alto do Pico das Cabras, em Joaquim Egídio. Uma experiência que une práticas de yoga, meditação e relaxamento, convidando você a despertar o corpo com suavidade e acalmar a mente enquanto o dia nasce. Em meio à natureza e com uma vista especial, é um momento para respirar, se reconectar e começar o dia com presença e leveza.',
              },
              {
                icone: <Moon className="w-8 h-8 text-terra" />,
                titulo: 'EntardeSer',
                cor: 'from-plum-100 to-cream',
                desc: 'É uma experiência de yoga ao pôr do sol para se recolher, soltar o excesso e voltar para dentro com calma e presença.',
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
        </div>
      </section>

      {/* Relatos */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-plum tracking-widest uppercase">Relatos</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { texto: 'Estava em busca de uma experiência inesquecível e encontrei o AmanheSer. Juro me faltam palavras… que evento fantástico! Millena você é luz e transmite isso o tempo todo. Sua alma é leve e eu amei cruzar o seu caminho.' },
            { texto: 'O Calmaria foi um presente de autocuidado. Obrigada pela condução gentil.' },
            { texto: 'Eu nunca tinha praticado yoga, mas o AmanheSer me despertou essa vontade. Foi uma experiência incrível.' },
          ].map((dep, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-sage p-6">
              <div className="flex gap-1 mb-3">
                {Array(5).fill(0).map((_, j) => (
                  <Star key={j} size={14} className="text-terra fill-terra" />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">&ldquo;{dep.texto}&rdquo;</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-sage py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-plum mb-4">
            Vamos viver essa experiência?
          </h2>
          <p className="text-plum/70 mb-8 text-lg">
            Reserve sua experiência e dê o primeiro passo rumo a mais presença e equilíbrio.
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
