import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createServiceClient()

  const { token } = await request.json()

  if (!token) {
    return NextResponse.json({ valido: false, erro: 'Token não informado' }, { status: 400 })
  }

  const { data: aula, error } = await supabase
    .from('aulas')
    .select('prevenda_token, prevenda, prevenda_inicio, prevenda_fim')
    .eq('id', id)
    .single()

  if (error || !aula) {
    return NextResponse.json({ valido: false, erro: 'Aula não encontrada' }, { status: 404 })
  }

  if (!aula.prevenda) {
    return NextResponse.json({ valido: false, erro: 'Esta aula não tem pré-venda' }, { status: 400 })
  }

  const hoje = new Date().toISOString().split('T')[0]
  const emPrevenda = aula.prevenda_inicio <= hoje && hoje <= aula.prevenda_fim

  if (!emPrevenda) {
    return NextResponse.json({ valido: false, erro: 'O período de pré-venda não está ativo' }, { status: 400 })
  }

  const valido = token.toUpperCase() === aula.prevenda_token

  return NextResponse.json({ valido })
}
