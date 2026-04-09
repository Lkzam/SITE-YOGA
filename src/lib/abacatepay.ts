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
  urlRetorno: string
  urlConclusao: string
}

interface RespostaCobranca {
  id: string
  url: string
  status: string
  valor: number
}

export async function criarCobranca(params: CriarCobrancaParams): Promise<RespostaCobranca> {
  const response = await fetch(`${API_URL}/billing/create`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      frequency: 'ONE_TIME',
      methods: ['PIX'],
      products: [
        {
          externalId: params.externalId,
          name: params.descricao,
          quantity: 1,
          price: params.valor,
        },
      ],
      returnUrl: params.urlRetorno,
      completionUrl: params.urlConclusao,
      customer: {
        name: params.cliente.nome,
        email: params.cliente.email,
        cellphone: params.cliente.celular,
        taxId: params.cliente.cpf,
      },
    }),
  })

  if (!response.ok) {
    const erro = await response.text()
    throw new Error(`AbacatePay erro: ${erro}`)
  }

  const data = await response.json()

  return {
    id: data.data?.id || data.id,
    url: data.data?.url || data.url,
    status: data.data?.status || data.status,
    valor: params.valor,
  }
}
