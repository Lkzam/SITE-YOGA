import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { criarCobranca } from '@/lib/abacatepay'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  const supabase = createServiceClient()

  const body = await request.json()
  const { aulaId, nome, email, telefone, cpf } = body

  if (!aulaId || !nome || !email || !telefone || !cpf) {
    return NextResponse.json({ erro: 'Preencha todos os campos obrigatórios' }, { status: 400 })
  }

  // Busca a aula
  const { data: aula, error: erroAula } = await supabase
    .from('aulas')
    .select('*')
    .eq('id', aulaId)
    .single()

  if (erroAula || !aula) {
    return NextResponse.json({ erro: 'Aula não encontrada' }, { status: 404 })
  }

  if (aula.vagas_disponiveis <= 0) {
    return NextResponse.json({ erro: 'Não há vagas disponíveis para esta aula' }, { status: 400 })
  }

  // Cria a reserva com status pendente
  const { data: reserva, error: erroReserva } = await supabase
    .from('reservas')
    .insert({
      id: randomUUID(),
      aula_id: aulaId,
      cliente_nome: nome,
      cliente_email: email,
      cliente_telefone: telefone,
      cliente_cpf: cpf.replace(/\D/g, ''),
      status: 'pendente',
    })
    .select()
    .single()

  if (erroReserva || !reserva) {
    const msg = erroReserva?.message || 'Erro ao criar reserva'
    console.error('Erro ao criar reserva no Supabase:', erroReserva)
    return NextResponse.json({ erro: msg }, { status: 500 })
  }

  // Formata CPF com máscara para enviar ao AbacatePay (ex: "123.456.789-01")
  const cpfFormatado = cpf
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')

  try {
    // Cria cobrança PIX transparente no AbacatePay v2
    const cobranca = await criarCobranca({
      valor: Math.round(aula.preco * 100), // converte para centavos
      descricao: `${aula.titulo} — ${aula.data} às ${aula.horario.slice(0, 5)}`,
      cliente: {
        nome,
        email,
        celular: telefone.replace(/\D/g, ''),
        cpf: cpfFormatado,
      },
      externalId: reserva.id,
    })

    // Salva o ID do pagamento na reserva
    await supabase
      .from('reservas')
      .update({ pagamento_id: cobranca.id })
      .eq('id', reserva.id)

    // Retorna dados do PIX para exibir na tela
    return NextResponse.json({
      brCode: cobranca.brCode,
      brCodeBase64: cobranca.brCodeBase64,
      expiresAt: cobranca.expiresAt,
      reservaId: reserva.id,
      valor: aula.preco,
    })
  } catch (error) {
    // Se falhar o pagamento, remove a reserva
    await supabase.from('reservas').delete().eq('id', reserva.id)
    const mensagem = error instanceof Error ? error.message : String(error)
    console.error('Erro AbacatePay:', mensagem)
    return NextResponse.json({ erro: mensagem }, { status: 500 })
  }
}
