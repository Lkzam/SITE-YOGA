'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { ArrowLeft, Calendar, Clock, MapPin, Users, DollarSign, Save, Tag, Copy, Check } from 'lucide-react'
import Link from 'next/link'

function gerarToken(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export default function NovaAulaPage() {
  const router = useRouter()
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)
  const [tokenGerado, setTokenGerado] = useState('')
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

  async function copiarToken() {
    await navigator.clipboard.writeText(tokenGerado)
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

    const supabase = createClient()
    const token = form.prevenda ? gerarToken() : null

    const { error } = await supabase.from('aulas').insert({
      titulo: form.titulo,
      descricao: form.descricao || null,
      data: form.data,
      horario: form.horario,
      localizacao: form.localizacao,
      vagas_total: Number(form.vagas_total),
      vagas_disponiveis: Number(form.vagas_total),
      preco: parseFloat(form.preco),
      ativa: true,
      prevenda: form.prevenda,
      prevenda_inicio: form.prevenda ? form.prevenda_inicio : null,
      prevenda_fim: form.prevenda ? form.prevenda_fim : null,
      prevenda_preco: form.prevenda ? parseFloat(form.prevenda_preco) : null,
      prevenda_token: token,
    })

    setEnviando(false)

    if (error) {
      setErro('Erro ao criar aula: ' + error.message)
      return
    }

    if (token) {
      setTokenGerado(token)
    }

    setSucesso(true)
    if (!token) {
      setTimeout(() => router.push('/admin/aulas'), 1500)
    }
  }

  if (sucesso && tokenGerado) {
    return (
      <div>
        <div className="flex items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Aula Criada!</h1>
            <p className="text-gray-500 text-sm">Sua aula foi criada com pré-venda</p>
          </div>
        </div>
        <div className="max-w-2xl">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag size={28} className="text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Token de Pré-venda Gerado</h2>
            <p className="text-gray-500 text-sm mb-6">
              Compartilhe este token com quem terá acesso à pré-venda. Ele será necessário para reservar a aula no período de pré-venda.
            </p>
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-6 mb-6">
              <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Token de acesso</p>
              <p className="text-4xl font-bold text-green-700 tracking-widest font-mono">{tokenGerado}</p>
            </div>
            <button
              onClick={copiarToken}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-green-200 text-green-700 font-semibold text-sm hover:bg-green-50 transition-colors mb-4"
            >
              {tokenCopiado ? <><Check size={16} /> Copiado!</> : <><Copy size={16} /> Copiar Token</>}
            </button>
            <Link
              href="/admin/aulas"
              className="block w-full text-center py-3 rounded-xl bg-green-700 text-white font-semibold text-sm hover:bg-green-800 transition-colors"
            >
              Ver todas as aulas
            </Link>
          </div>
        </div>
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
          <h1 className="text-2xl font-bold text-gray-800">Nova Aula</h1>
          <p className="text-gray-500 text-sm">Cadastre uma nova aula para os alunos</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {sucesso && !tokenGerado && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 mb-6 text-sm font-medium">
              Aula criada com sucesso! Redirecionando...
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
                placeholder="Ex: Rua das Flores, 123 — Sala 4, Pinheiros, SP"
                value={form.localizacao}
                onChange={(e) => setForm({ ...form, localizacao: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label flex items-center gap-1">
                  <Users size={13} className="text-green-600" /> Vagas *
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
                    Clientes com token têm acesso exclusivo a um preço menor antes do lançamento público
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
                      className="input-field border-orange-200 focus:ring-orange-400"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Ex: 60.00 (menor que o preço normal)"
                      value={form.prevenda_preco}
                      onChange={(e) => setForm({ ...form, prevenda_preco: e.target.value })}
                      required={form.prevenda}
                    />
                  </div>
                  <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-xs text-orange-700">
                    🔑 Um token de acesso exclusivo será gerado ao criar a aula. Compartilhe com quem terá acesso à pré-venda.
                  </div>
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
                className="btn-admin flex-1 flex items-center justify-center gap-2"
              >
                {enviando ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={16} />
                    Criar Aula
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
