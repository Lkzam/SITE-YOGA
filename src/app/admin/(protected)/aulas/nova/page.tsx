'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { ArrowLeft, Calendar, Clock, MapPin, Users, DollarSign, Save } from 'lucide-react'
import Link from 'next/link'

export default function NovaAulaPage() {
  const router = useRouter()
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)

  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    data: '',
    horario: '',
    localizacao: '',
    vagas_total: '',
    preco: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setEnviando(true)

    const supabase = createClient()

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
    })

    setEnviando(false)

    if (error) {
      setErro('Erro ao criar aula: ' + error.message)
      return
    }

    setSucesso(true)
    setTimeout(() => router.push('/admin/aulas'), 1500)
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
          {sucesso && (
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
                  <DollarSign size={13} className="text-green-600" /> Preço (R$) *
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
