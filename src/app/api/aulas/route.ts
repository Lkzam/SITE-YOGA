import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  const supabase = createServiceClient()
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (id) {
    const { data, error } = await supabase
      .from('aulas')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return NextResponse.json({ erro: error.message }, { status: 404 })
    return NextResponse.json(data)
  }

  const hoje = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('aulas')
    .select('*')
    .eq('ativa', true)
    .gte('data', hoje)
    .order('data', { ascending: true })

  if (error) return NextResponse.json({ erro: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = createServiceClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })
  }

  const body = await request.json()
  const { titulo, descricao, data, horario, localizacao, vagas_total, preco } = body

  if (!titulo || !data || !horario || !localizacao || !vagas_total || !preco) {
    return NextResponse.json({ erro: 'Campos obrigatórios faltando' }, { status: 400 })
  }

  const { data: aula, error } = await supabase
    .from('aulas')
    .insert({
      titulo,
      descricao,
      data,
      horario,
      localizacao,
      vagas_total: Number(vagas_total),
      vagas_disponiveis: Number(vagas_total),
      preco: Number(preco),
    })
    .select()
    .single()

  if (error) return NextResponse.json({ erro: error.message }, { status: 500 })
  return NextResponse.json(aula, { status: 201 })
}
