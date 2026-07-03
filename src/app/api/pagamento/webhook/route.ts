import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { timingSafeEqual } from 'crypto'

function tokenValido(token: string | null): boolean {
  const esperado = process.env.ASAAS_WEBHOOK_TOKEN
  if (!esperado || !token) return false
  const a = Buffer.from(token)
  const b = Buffer.from(esperado)
  return a.length === b.length && timingSafeEqual(a, b)
}

// Webhook do Asaas — chamado automaticamente quando o pagamento PIX é confirmado
export async function POST(request: NextRequest) {
  const supabase = createServiceClient()

  // Asaas envia o token configurado no cabeçalho 'asaas-access-token'
  const token = request.headers.get('asaas-access-token')
  if (!tokenValido(token)) {
    console.error('Webhook Asaas: token inválido ou ausente')
    return NextResponse.json({ ok: false, erro: 'Não autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { event, payment } = body

    // PIX confirmado (PAYMENT_RECEIVED = confirmado via PIX)
    if (event === 'PAYMENT_RECEIVED' || event === 'PAYMENT_CONFIRMED') {
      const externalReference = payment?.externalReference

      if (!externalReference) {
        console.error('Webhook Asaas: externalReference não encontrado no payload', JSON.stringify(body))
        return NextResponse.json({ ok: false, erro: 'externalReference não encontrado' }, { status: 400 })
      }

      // Busca a reserva para checar se já foi processada (idempotência)
      const { data: reserva, error: erroBusca } = await supabase
        .from('reservas')
        .select('id, aula_id, status')
        .eq('id', externalReference)
        .single()

      if (erroBusca || !reserva) {
        console.error('Webhook Asaas: reserva não encontrada para', externalReference)
        return NextResponse.json({ ok: false, erro: 'Reserva não encontrada' }, { status: 404 })
      }

      // Se já estava paga, não processa de novo
      if (reserva.status === 'pago') {
        return NextResponse.json({ ok: true })
      }

      const { error: erroUpdate } = await supabase
        .from('reservas')
        .update({
          status: 'pago',
          valor_pago: payment?.value || 0, // Asaas já envia em reais
        })
        .eq('id', externalReference)

      if (erroUpdate) {
        console.error('Erro ao atualizar reserva:', erroUpdate)
        return NextResponse.json({ ok: false }, { status: 500 })
      }

      // Decrementa a vaga de forma atômica
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
