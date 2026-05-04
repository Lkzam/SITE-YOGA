'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, MapPin, Users, DollarSign, Save, Tag, Copy, Check } from 'lucide-react'
import Link from 'next/link'

function gerarToken(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export default function EditarAulaPage() {
  const router = useRouter()
  const { id } = useParams()

  const [carregando, setCarregando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)
  const [tokenAtual, setTokenAtual] = useState('')
  const [tokenCopiado, setTokenCopiado] = useState(false)

  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    data: '',
    horario: '',
    localizacao: '',
    vagas_total: '',
    preco: '',
    prevenda: false,
    prevenda_inicio: '',
    prevenda_fim: '',
    prevenda_preco: '',
  })

  useEffect(() => {
    fetch(`/api/aulas/${id}`)
      .then((res) => res.json())
      .then((aula) => {
        setForm({
          titulo: aula.titulo || '',
          descricao: aula.descricao || '',
          data: aula.data || '',
          horario: aula.horario?.slice(0, 5) || '',
          localizacao: aula.localizacao || '',
          vagas_total: String(aula.vagas_total || ''),
          preco: String(aula.preco || ''),
          prevenda: aula.prevenda || false,
          prevenda_inicio: aula.prevenda_inicio || '',
          prevenda_fim: aula.prevenda_fim || '',
          prevenda_preco: aula.prevenda_preco ? String(aula.prevenda_preco) : '',
        })
        setTokenAtual(aula.prevenda_token || '')
        setCarregando(false)
      })
      .catch(() => {
        setErro('Erro ao carregar aula.')
        setCarregando(false)
      })
  }, [id])

  async function copiarToken() {
    await navigator.clipboard.writeText(tokenAtual)
    setTokenCopiado(true)
    setTimeout(() => setTokenCopiado(false), 3000)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setEnviando(true)

    if (form.prevenda) {
      if (!form.prevenda_inicio || !form.prevenda_fim || !form.prevenda_preco) {
        setErro('Preencha todas as datas e o preço da pré-venda.')
        setEnviando(false)
        return
      }
      if (form.prevenda_fim <= form.prevenda_inicio) {
        setErro('A data de fim da pré-venda deve ser após a data de início.')
        setEnviando(false)
        return
      }
      if (parseFloat(form.prevenda_preco) >= parseFloat(form.preco)) {
        setErro('O preço da pré-venda deve ser menor que o preço normal.')
        setEnviando(false)
        return
      }
    }

    // Se ativou prevenda e não tem token ainda, gera um novo
    const novoToken = form.prevenda && !tokenAtual ? gerarToken() : undefined

    const res = await fetch(`/api/aulas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, novoToken }),
    })

    const data = await res.json()
    setEnviando(false)

    if (!res.ok) {
      setErro(data.erro || 'Erro ao salvar alterações.')
      return
    }

    if (novoToken) setTokenAtual(novoToken)
    setSucesso(true)
    setTimeout(() => router.push('/admin/aulas'), 2000)
  }

  if (carregando) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-green-300 border-t-green-700 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/aulas" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Editar Aula</h1>
          <p className="text-gray-500 text-sm">Altere as informações da aula</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {sucesso && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 mb-6 text-sm font-medium">
              Aula atualizada com sucesso! Redirecionando...
            </div>
          )}

          {/* Token atual (se existir) */}
          {tokenAtual && form.prevenda && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
              <p className="text-xs text-orange-600 font-semibold mb-2 uppercase tracking-wide">Token de Pré-venda Atual</p>
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-xl font-bold text-orange-700 tracking-widest">{tokenAtual}</span>
                <button
                  onClick={copiarToken}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-orange-200 text-orange-600 hover:bg-orange-100 transition-colors"
                >
                  {tokenCopiado ? <><Check size={13} /> Copiado</> : <><Copy size={13} /> Copiar</>}
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="label">Título da Aula *</label>
              <input
                className="input-field"
                placeholder="Ex: Hatha Yoga para Iniciantes"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="label">Descrição</label>
              <textarea
                className="input-field resize-none"
                rows={3}
                placeholder="Descreva o conteúdo e nível da aula..."
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label flex items-center gap-1">
                  <Calendar size={13} className="text-green-600" /> Data *
                </label>
                <input
                  className="input-field"
                  type="date"
                  value={form.data}
                  onChange={(e) => setForm({ ...form, data: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label flex items-center gap-1">
                  <Clock size={13} className="text-green-600" /> Horário *
                </label>
                <input
                  className="input-field"
                  type="time"
                  value={form.horario}
                  onChange={(e) => setForm({ ...form, horario: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label flex items-center gap-1">
                <MapPin size={13} className="text-green-600" /> Localização *
              </label>
              <input
                className="input-field"
                placeholder="Ex: Rua das Flores, 123 — Sala 4"
                value={form.localizacao}
                onChange={(e) => setForm({ ...form, localizacao: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label flex items-center gap-1">
                  <Users size={13} className="text-green-600" /> Total de Vagas *
                </label>
                <input
                  className="input-field"
                  type="number"
                  min="1"
                  max="100"
                  placeholder="Ex: 15"
                  value={form.vagas_total}
                  onChange={(e) => setForm({ ...form, vagas_total: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label flex items-center gap-1">
                  <DollarSign size={13} className="text-green-600" /> Preço Normal (R$) *
                </label>
                <input
                  className="input-field"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Ex: 80.00"
                  value={form.preco}
                  onChange={(e) => setForm({ ...form, preco: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Toggle pré-venda */}
            <div className="border border-gray-200 rounded-xl p-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                    <Tag size={15} className="text-orange-500" />
                    Esta aula terá pré-venda
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Clientes com token têm acesso exclusivo a um preço menor
                  </p>
                </div>
                <div
                  onClick={() => setForm({ ...form, prevenda: !form.prevenda })}
                  className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${form.prevenda ? 'bg-orange-500' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.prevenda ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
              </label>

              {form.prevenda && (
                <div className="mt-4 flex flex-col gap-4 border-t border-gray-100 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Início da Pré-venda *</label>
                      <input
                        className="input-field"
                        type="date"
                        value={form.prevenda_inicio}
                        onChange={(e) => setForm({ ...form, prevenda_inicio: e.target.value })}
                        required={form.prevenda}
                      />
                    </div>
                    <div>
                      <label className="label">Fim da Pré-venda *</label>
                      <input
                        className="input-field"
                        type="date"
                        value={form.prevenda_fim}
                        onChange={(e) => setForm({ ...form, prevenda_fim: e.target.value })}
                        required={form.prevenda}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label flex items-center gap-1">
                      <DollarSign size={13} className="text-orange-500" /> Preço Pré-venda (R$) *
                    </label>
                    <input
                      className="input-field"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Ex: 60.00 (menor que o preço normal)"
                      value={form.prevenda_preco}
                      onChange={(e) => setForm({ ...form, prevenda_preco: e.target.value })}
                      required={form.prevenda}
                    />
                  </div>
                  {!tokenAtual && (
                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-xs text-orange-700">
                      🔑 Um novo token será gerado ao salvar.
                    </div>
                  )}
                </div>
              )}
            </div>

            {erro && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">
                {erro}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Link href="/admin/aulas" className="btn-secondary flex-1 text-center">
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={enviando || sucesso}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {enviando ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={16} />
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
