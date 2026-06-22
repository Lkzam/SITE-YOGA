import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { timingSafeEqual } from 'crypto'

function secretValido(recebido: string | null): boolean {
  const esperado = process.env.ABACATEPAY_WEBHOOK_SECRET
  if (!esperado || !recebido) return false
  const a = Buffer.from(recebido)
  const b = Buffer.from(esperado)
  return a.length === b.length && timingSafeEqual(a, b)
}

// Webhook do AbacatePay — chamado automaticamente quando o pagamento é confirmado
export async function POST(request: NextRequest) {
  const supabase = createServiceClient()

  // Valida o secret enviado na query string (configurado no painel do AbacatePay)
  const webhookSecret = request.nextUrl.searchParams.get('webhookSecret')
  if (!secretValido(webhookSecret)) {
    console.error('Webhook: secret inválido ou ausente')
    return NextResponse.json({ ok: false, erro: 'Não autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()

    // Estrutura do webhook AbacatePay
    const { event, data } = body

    // AbacatePay v2: evento de PIX transparente confirmado
    if (event === 'transparent.completed') {
      const externalId = data?.externalId

      if (!externalId) {
        console.error('Webhook: externalId não encontrado no payload', JSON.stringify(body))
        return NextResponse.json({ ok: false, erro: 'externalId não encontrado' }, { status: 400 })
      }

      // Busca a reserva para checar se já foi processada (evita decrementar vagas duas vezes)
      const { data: reserva, error: erroBusca } = await supabase
        .from('reservas')
        .select('id, aula_id, status')
        .eq('id', externalId)
        .single()

      if (erroBusca || !reserva) {
        console.error('Webhook: reserva não encontrada para externalId', externalId)
        return NextResponse.json({ ok: false, erro: 'Reserva não encontrada' }, { status: 404 })
      }

      // Idempotência: se já estava paga, não processa de novo
      if (reserva.status === 'pago') {
        return NextResponse.json({ ok: true })
      }

      const { error: erroUpdate } = await supabase
        .from('reservas')
        .update({
          status: 'pago',
          valor_pago: (data?.amount || 0) / 100,
        })
        .eq('id', externalId)

      if (erroUpdate) {
        console.error('Erro ao atualizar reserva:', erroUpdate)
        return NextResponse.json({ ok: false }, { status: 500 })
      }

      // Decrementa a vaga disponível de forma atômica (função no banco evita corrida)
      const { error: erroVaga } = await supabase.rpc('decrementar_vaga', {
        p_aula_id: reserva.aula_id,
      })

      if (erroVaga) {
        console.error('Erro ao decrementar vaga:', erroVaga)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Webhook erro:', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
