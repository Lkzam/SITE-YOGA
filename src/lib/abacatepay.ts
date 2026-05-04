const API_URL = process.env.ABACATEPAY_API_URL!
const API_KEY = process.env.ABACATEPAY_API_KEY!

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
  brCode: string        // código PIX copia e cola
  brCodeBase64: string  // QR code em base64
  expiresAt: string     // data/hora de expiração
}

export async function criarCobranca(params: CriarCobrancaParams): Promise<RespostaCobranca> {
  const response = await fetch(`${API_URL}/transparents/create`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      method: 'PIX',
      data: {
        amount: params.valor,
        expiresIn: 3600, // 1 hora
        description: params.descricao,
        externalId: params.externalId,
        customer: {
          name: params.cliente.nome,
          email: params.cliente.email,
          cellphone: params.cliente.celular,
          taxId: params.cliente.cpf,
        },
      },
    }),
  })

  if (!response.ok) {
    const erro = await response.text()
    throw new Error(`AbacatePay erro: ${erro}`)
  }

  const json = await response.json()

  if (!json.success) {
    throw new Error(`AbacatePay erro: ${json.error}`)
  }

  const data = json.data

  return {
    id: data.id,
    brCode: data.brCode || data.pix?.brCode || '',
    brCodeBase64: data.brCodeBase64 || data.pix?.brCodeBase64 || '',
    expiresAt: data.expiresAt || '',
  }
}
