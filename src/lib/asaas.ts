const API_URL = process.env.ASAAS_API_URL!
const API_KEY = process.env.ASAAS_API_KEY!

// Headers padrão para todas as chamadas ao Asaas.
// O Asaas exige o header access_token e recomenda um User-Agent.
function headers(extra?: Record<string, string>) {
  return {
    access_token: API_KEY,
    'User-Agent': 'IntuirYoga/1.0',
    ...extra,
  }
}

// Monta uma mensagem de erro útil com o status HTTP e o corpo (se houver).
async function erroAsaas(contexto: string, res: Response): Promise<Error> {
  let corpo = ''
  try {
    corpo = await res.text()
  } catch {
    corpo = ''
  }
  const detalhe = corpo || '(resposta sem corpo)'
  console.error(`Asaas ${contexto} — HTTP ${res.status} ${res.statusText}: ${detalhe}`)
  return new Error(`Asaas ${contexto} (HTTP ${res.status}): ${detalhe}`)
}

interface CriarCobrancaParams {
  valor: number // em centavos
  descricao: string
  cliente: {
    nome: string
    email: string
    celular: string
    cpf: string
  }
  externalId: string
}

interface RespostaCobranca {
  id: string
  brCode: string
  brCodeBase64: string
  expiresAt: string
}

async function obterOuCriarCliente(cliente: CriarCobrancaParams['cliente']): Promise<string> {
  const cpfLimpo = cliente.cpf.replace(/\D/g, '')

  // Tenta encontrar cliente existente pelo CPF para evitar duplicatas
  const busca = await fetch(`${API_URL}/customers?cpfCnpj=${cpfLimpo}`, {
    headers: headers(),
  })

  if (busca.ok) {
    const resultado = await busca.json()
    if (resultado.data && resultado.data.length > 0) {
      return resultado.data[0].id
    }
  }

  const res = await fetch(`${API_URL}/customers`, {
    method: 'POST',
    headers: headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      name: cliente.nome,
      email: cliente.email,
      mobilePhone: cliente.celular.replace(/\D/g, ''),
      cpfCnpj: cpfLimpo,
    }),
  })

  if (!res.ok) {
    throw await erroAsaas('erro ao criar cliente', res)
  }

  const data = await res.json()
  return data.id
}

export async function criarCobranca(params: CriarCobrancaParams): Promise<RespostaCobranca> {
  const customerId = await obterOuCriarCliente(params.cliente)

  const dataVencimento = new Date()
  dataVencimento.setDate(dataVencimento.getDate() + 1)
  const dueDate = dataVencimento.toISOString().split('T')[0]

  const paymentRes = await fetch(`${API_URL}/payments`, {
    method: 'POST',
    headers: headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      customer: customerId,
      billingType: 'PIX',
      value: params.valor / 100, // Asaas usa reais, não centavos
      dueDate,
      description: params.descricao,
      externalReference: params.externalId,
    }),
  })

  if (!paymentRes.ok) {
    throw await erroAsaas('erro ao criar pagamento', paymentRes)
  }

  const payment = await paymentRes.json()

  const qrRes = await fetch(`${API_URL}/payments/${payment.id}/pixQrCode`, {
    headers: headers(),
  })

  if (!qrRes.ok) {
    throw await erroAsaas('erro ao buscar QR Code', qrRes)
  }

  const qr = await qrRes.json()

  return {
    id: payment.id,
    brCode: qr.payload,
    brCodeBase64: qr.encodedImage,
    expiresAt: qr.expirationDate || dueDate,
  }
}
