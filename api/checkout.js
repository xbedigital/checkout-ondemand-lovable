const produtos = [
  { id: 1, nome: "Coleta de Dados + Criação e/ou Configuração de BM, Página Comercial e Conta de Anúncio", valor: 7990 },
  { id: 2, nome: "Campanha de Gestão de Tráfego Pago - Meta Ads", valor: 37890, adicional: 31890 },
  { id: 3, nome: "Campanha Google Ads", valor: 47890, adicional: 41890 },
  { id: 4, nome: "Copy para arte", valor: 1990 },
  { id: 5, nome: "Copy para carrossel", valor: 3990 },
  { id: 6, nome: "Copy para vídeo", valor: 5990 },
  { id: 7, nome: "Criativo arte", valor: 3990 },
  { id: 8, nome: "Criativo carrossel", valor: 9990 },
  { id: 9, nome: "Edição de vídeo", valor: 11990 },
  { id: 10, nome: "Relatório de métricas (mensal)", valor: 4490 },
  { id: 11, nome: "Copy para landing page", valor: 24990 },
  { id: 12, nome: "Criação de Landing Page", valor: 119900 }
];

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido" });

  const { itens } = req.body;

  const produtosSelecionados = itens.map(i => {
    const produto = produtos.find(p => p.id === i.id);
    return {
      title: produto.nome,
      unit_price: produto.valor,
      quantity: i.quantidade
    };
  });

  const payload = {
    items: produtosSelecionados
  };

  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  return res.status(200).json(data);
}
