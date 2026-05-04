'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Calendar, Clock, MapPin, Users, ArrowLeft, Lock, Copy, Check, Key } from 'lucide-react'
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
  prevenda?: boolean
  prevenda_inicio?: string
  prevenda_fim?: string
  prevenda_preco?: number
}

interface DadosPix {
  brCode: string
  brCodeBase64: string
  expiresAt: string
  reservaId: string
  valor: number
}

export default function ReservarPage() {
  const { id } = useParams()
  const [aula, setAula] = useState<Aula | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  const [pix, setPix] = useState<DadosPix | null>(null)
  const [copiado, setCopiado] = useState(false)

  // Fluxo de token pré-venda
  const [emPrevenda, setEmPrevenda] = useState(false)
  const [tokenInput, setTokenInput] = useState('')
  const [tokenValido, setTokenValido] = useState(false)
  const [validandoToken, setValidandoToken] = useState(false)
  const [erroToken, setErroToken] = useState('')

  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
  })

  useEffect(() => {
    fetch(`/api/aulas/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Aula não encontrada')
        return res.json()
      })
      .then((data) => {
        setAula(data)
        // Verifica se está em período de pré-venda
        const hoje = new Date().toISOString().split('T')[0]
        const prevenda = !!(
          data.prevenda &&
          data.prevenda_inicio &&
          data.prevenda_fim &&
          data.prevenda_inicio <= hoje &&
          hoje <= data.prevenda_fim
        )
        setEmPrevenda(prevenda)
        setCarregando(false)
      })
      .catch(() => {
        setErro('Erro ao carregar aula. Tente novamente.')
        setCarregando(false)
      })
  }, [id])

  // Preço correto baseado no estado
  const precoUsado = emPrevenda && tokenValido && aula?.prevenda_preco
    ? aula.prevenda_preco
    : aula?.preco ?? 0

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

  async function copiarCodigo() {
    if (!pix) return
    await navigator.clipboard.writeText(pix.brCode)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 3000)
  }

  async function validarToken(e: React.FormEvent) {
    e.preventDefault()
    setErroToken('')
    setValidandoToken(true)

    try {
      const res = await fetch(`/api/aulas/${id}/validar-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenInput.trim().toUpperCase() }),
      })
      const data = await res.json()
      if (data.valido) {
        setTokenValido(true)
      } else {
        setErroToken(data.erro || 'Token inválido. Verifique e tente novamente.')
      }
    } catch {
      setErroToken('Erro de conexão. Tente novamente.')
    } finally {
      setValidandoToken(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setEnviando(true)

    try {
      const response = await fetch('/api/pagamento/criar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aulaId: id,
          ...form,
          token: emPrevenda && tokenValido ? tokenInput.trim().toUpperCase() : undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErro(data.erro || 'Erro ao processar reserva. Tente novamente.')
        return
      }

      setPix(data)
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

  if (!aula) return (
    <main className="min-h-screen">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-600 text-sm">
          {erro || 'Aula não encontrada.'}
        </div>
      </div>
    </main>
  )

  const dataFormatada = format(parseISO(aula.data), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })

  // Tela de pagamento PIX
  if (pix) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <section className="max-w-lg mx-auto px-4 py-10">
          <div className="card text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-green-900 mb-1">Pague via PIX</h1>
            <p className="text-gray-500 text-sm mb-6">
              Escaneie o QR Code ou copie o código para pagar
            </p>

            <div className="bg-green-50 rounded-xl p-3 mb-6">
              <p className="text-sm text-green-700 font-medium">Valor a pagar</p>
              <p className="text-3xl font-bold text-green-800">
                R$ {pix.valor.toFixed(2).replace('.', ',')}
              </p>
              <p className="text-xs text-green-600 mt-1">{aula.titulo}</p>
            </div>

            {pix.brCodeBase64 && (
              <div className="flex justify-center mb-6">
                <img
                  src={pix.brCodeBase64.startsWith('data:') ? pix.brCodeBase64 : `data:image/png;base64,${pix.brCodeBase64}`}
                  alt="QR Code PIX"
                  className="w-56 h-56 border border-gray-200 rounded-xl"
                />
              </div>
            )}

            <div className="mb-6">
              <p className="text-xs text-gray-500 mb-2 font-medium">PIX Copia e Cola</p>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-left">
                <p className="text-xs text-gray-600 break-all font-mono leading-relaxed">
                  {pix.brCode}
                </p>
              </div>
              <button
                onClick={copiarCodigo}
                className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-green-200 text-green-700 font-semibold text-sm hover:bg-green-50 transition-colors"
              >
                {copiado ? (
                  <><Check size={16} /> Código copiado!</>
                ) : (
                  <><Copy size={16} /> Copiar código PIX</>
                )}
              </button>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-400 mb-4">
                Após o pagamento, sua vaga será confirmada automaticamente. Você receberá uma confirmação no e-mail <strong>{form.email}</strong>.
              </p>
              <Link
                href="/confirmacao"
                className="block w-full text-center py-3 rounded-xl bg-green-700 text-white font-semibold text-sm hover:bg-green-800 transition-colors"
              >
                Já paguei — Ver confirmação
              </Link>
              <Link href="/aulas" className="block text-center text-xs text-gray-400 mt-3 hover:text-gray-600">
                Voltar às aulas
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  // Tela de token (pré-venda ativa e token ainda não validado)
  if (emPrevenda && !tokenValido) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <section className="max-w-md mx-auto px-4 py-10">
          <Link href="/aulas" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-800 mb-6 text-sm font-medium">
            <ArrowLeft size={16} /> Voltar às aulas
          </Link>

          <div className="card text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={28} className="text-orange-500" />
            </div>

            <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              PRÉ-VENDA EXCLUSIVA
            </div>

            <h1 className="text-xl font-bold text-gray-900 mb-2">{aula.titulo}</h1>
            <p className="text-gray-500 text-sm mb-2">
              Esta aula está em período de pré-venda.
            </p>

            {aula.prevenda_preco && (
              <div className="bg-orange-50 rounded-xl p-3 mb-6">
                <p className="text-sm text-orange-700 font-medium">Preço exclusivo pré-venda</p>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-2xl font-bold text-orange-600">
                    R$ {aula.prevenda_preco.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    R$ {aula.preco.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
            )}

            <p className="text-gray-500 text-sm mb-6">
              Digite o token de acesso para continuar com a reserva.
            </p>

            <form onSubmit={validarToken} className="flex flex-col gap-4">
              <div className="relative">
                <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="input-field pl-9 text-center text-lg font-mono tracking-widest uppercase"
                  placeholder="XXXXXXXX"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value.toUpperCase())}
                  maxLength={8}
                  required
                  autoFocus
                />
              </div>

              {erroToken && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">
                  {erroToken}
                </div>
              )}

              <button
                type="submit"
                disabled={validandoToken || tokenInput.length < 6}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors disabled:opacity-50"
              >
                {validandoToken ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><Key size={16} /> Validar Token</>
                )}
              </button>
            </form>

            <p className="text-xs text-gray-400 mt-4">
              Não tem o token? Fale com a professora para obter acesso à pré-venda.
            </p>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  // Tela de formulário principal
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="max-w-4xl mx-auto px-4 py-10">
        <Link href="/aulas" className="inline-flex items-center gap-2 text-green-700 hover:text-green-900 mb-6 text-sm font-medium">
          <ArrowLeft size={16} /> Voltar às aulas
        </Link>

        <h1 className="text-2xl md:text-3xl font-bold text-green-900 mb-8">Reservar sua vaga</h1>

        {emPrevenda && tokenValido && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-6 flex items-center gap-2 text-sm text-orange-700 font-medium">
            <Check size={16} className="text-orange-500 shrink-0" />
            Token validado! Você está reservando no preço exclusivo de pré-venda.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Resumo da aula */}
          <div>
            <div className="card mb-4">
              <div className={`h-2 bg-gradient-to-r -mx-6 -mt-6 mb-6 rounded-t-2xl ${emPrevenda ? 'from-orange-400 to-orange-600' : 'from-green-500 to-green-700'}`} />
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

            <div className={`card ${emPrevenda ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'}`}>
              <div className="flex justify-between items-center">
                <span className={`font-semibold ${emPrevenda ? 'text-orange-800' : 'text-green-800'}`}>Total a pagar</span>
                <div className="text-right">
                  <span className={`text-2xl font-bold ${emPrevenda ? 'text-orange-600' : 'text-green-700'}`}>
                    R$ {precoUsado.toFixed(2).replace('.', ',')}
                  </span>
                  {emPrevenda && (
                    <p className="text-xs text-gray-400 line-through">
                      R$ {aula.preco.toFixed(2).replace('.', ',')}
                    </p>
                  )}
                </div>
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
                className={`flex items-center justify-center gap-2 mt-2 py-3 rounded-xl font-semibold text-white transition-colors ${
                  emPrevenda
                    ? 'bg-orange-500 hover:bg-orange-600'
                    : 'btn-primary'
                }`}
              >
                {enviando ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    Gerar PIX — R$ {precoUsado.toFixed(2).replace('.', ',')}
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
