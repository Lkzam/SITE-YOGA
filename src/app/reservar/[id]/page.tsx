'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase-client'
import { Calendar, Clock, MapPin, Users, ArrowLeft, Lock } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'

interface Aula {
  id: string
  titulo: string
  descricao: string
  data: string
  horario: string
  localizacao: string
  vagas_disponiveis: number
  preco: number
}

export default function ReservarPage() {
  const { id } = useParams()
  const router = useRouter()
  const [aula, setAula] = useState<Aula | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')

  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
  })

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('aulas')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          router.push('/aulas')
          return
        }
        setAula(data)
        setCarregando(false)
      })
  }, [id, router])

  function formatarCPF(valor: string) {
    return valor
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .slice(0, 14)
  }

  function formatarTelefone(valor: string) {
    return valor
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setEnviando(true)

    try {
      const response = await fetch('/api/pagamento/criar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aulaId: id, ...form }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErro(data.erro || 'Erro ao processar reserva. Tente novamente.')
        return
      }

      // Redireciona para o link de pagamento do AbacatePay
      window.location.href = data.urlPagamento
    } catch {
      setErro('Erro de conexão. Verifique sua internet e tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  if (carregando) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="w-10 h-10 border-4 border-green-300 border-t-green-700 rounded-full animate-spin" />
        </div>
      </main>
    )
  }

  if (!aula) return null

  const dataFormatada = format(parseISO(aula.data), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="max-w-4xl mx-auto px-4 py-10">
        <Link href="/aulas" className="inline-flex items-center gap-2 text-green-700 hover:text-green-900 mb-6 text-sm font-medium">
          <ArrowLeft size={16} /> Voltar às aulas
        </Link>

        <h1 className="text-2xl md:text-3xl font-bold text-green-900 mb-8">Reservar sua vaga</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Resumo da aula */}
          <div>
            <div className="card mb-4">
              <div className="h-2 bg-gradient-to-r from-green-500 to-green-700 -mx-6 -mt-6 mb-6 rounded-t-2xl" />
              <h2 className="text-lg font-bold text-green-900 mb-4">{aula.titulo}</h2>

              {aula.descricao && (
                <p className="text-gray-500 text-sm mb-4">{aula.descricao}</p>
              )}

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={15} className="text-green-600" />
                  <span className="capitalize">{dataFormatada}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={15} className="text-green-600" />
                  <span>{aula.horario.slice(0, 5)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={15} className="text-green-600" />
                  <span>{aula.localizacao}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users size={15} className="text-green-600" />
                  <span>{aula.vagas_disponiveis} vagas disponíveis</span>
                </div>
              </div>
            </div>

            <div className="card bg-green-50 border-green-200">
              <div className="flex justify-between items-center">
                <span className="text-green-800 font-semibold">Total a pagar</span>
                <span className="text-2xl font-bold text-green-700">
                  R$ {aula.preco.toFixed(2).replace('.', ',')}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                <Lock size={12} />
                <span>Pagamento seguro via PIX — AbacatePay</span>
              </div>
            </div>
          </div>

          {/* Formulário */}
          <div className="card">
            <h2 className="text-lg font-bold text-green-900 mb-6">Seus dados</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="label">Nome completo *</label>
                <input
                  className="input-field"
                  type="text"
                  placeholder="Seu nome completo"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="label">E-mail *</label>
                <input
                  className="input-field"
                  type="email"
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="label">Telefone / WhatsApp *</label>
                <input
                  className="input-field"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={form.telefone}
                  onChange={(e) => setForm({ ...form, telefone: formatarTelefone(e.target.value) })}
                  required
                />
              </div>

              <div>
                <label className="label">CPF *</label>
                <input
                  className="input-field"
                  type="text"
                  placeholder="000.000.000-00"
                  value={form.cpf}
                  onChange={(e) => setForm({ ...form, cpf: formatarCPF(e.target.value) })}
                  required
                />
              </div>

              {erro && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">
                  {erro}
                </div>
              )}

              <button
                type="submit"
                disabled={enviando}
                className="btn-primary flex items-center justify-center gap-2 mt-2"
              >
                {enviando ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    Ir para Pagamento — R$ {aula.preco.toFixed(2).replace('.', ',')}
                  </>
                )}
              </button>

              <p className="text-xs text-gray-400 text-center">
                Ao reservar, você concorda com os termos de uso. Pagamento processado com segurança.
              </p>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
