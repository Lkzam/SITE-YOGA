import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'

// Webhook do AbacatePay — chamado automaticamente quando o pagamento é confirmado
export async function POST(request: NextRequest) {
  const supabase = await createServiceClient()

  try {
    const body = await request.json()

    // Estrutura do webhook AbacatePay
    const { event, data } = body

    if (event === 'billing.paid' || event === 'BILLING_PAID') {
      const pagamentoId = data?.id || data?.billing?.id
      const externalId = data?.products?.[0]?.externalId || data?.billing?.products?.[0]?.externalId

      if (!externalId) {
        return NextResponse.json({ ok: false, erro: 'externalId não encontrado' }, { status: 400 })
      }

      // Atualiza status da reserva para pago
      const { error } = await supabase
        .from('reservas')
        .update({
          status: 'pago',
          valor_pago: (data?.amount || data?.billing?.amount || 0) / 100,
        })
        .eq('id', externalId)

      if (error) {
        console.error('Erro ao atualizar reserva:', error)
        return NextResponse.json({ ok: false }, { status: 500 })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Webhook erro:', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
