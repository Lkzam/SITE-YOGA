import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('aulas')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json({ erro: 'Aula não encontrada' }, { status: 404 })
  }

  return NextResponse.json(data)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createServiceClient()

  const body = await request.json()
  const { titulo, descricao, data, horario, localizacao, vagas_total, preco,
          prevenda, prevenda_inicio, prevenda_fim, prevenda_preco, novoToken } = body

  if (!titulo || !data || !horario || !localizacao || !vagas_total || !preco) {
    return NextResponse.json({ erro: 'Preencha todos os campos obrigatórios' }, { status: 400 })
  }

  const updateData: Record<string, unknown> = {
    titulo,
    descricao: descricao || null,
    data,
    horario,
    localizacao,
    vagas_total: Number(vagas_total),
    preco: parseFloat(preco),
    prevenda: prevenda || false,
    prevenda_inicio: prevenda ? prevenda_inicio : null,
    prevenda_fim: prevenda ? prevenda_fim : null,
    prevenda_preco: prevenda ? parseFloat(prevenda_preco) : null,
  }

  // Se um novo token foi gerado no cliente (ativou pré-venda pela primeira vez)
  if (novoToken) updateData.prevenda_token = novoToken

  const { error } = await supabase
    .from('aulas')
    .update(updateData)
    .eq('id', id)

  if (error) {
    return NextResponse.json({ erro: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
