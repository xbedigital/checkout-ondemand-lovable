export default async function handler(req, res) {
  try {
    const data = req.method === 'POST' ? req.body : req.query;
    const { nome, email, cpf, telefone, itensSelecionados } = data;

    // Verificação rápida: itensSelecionados precisa ser array
    if (!Array.isArray(itensSelecionados)) {
      throw new Error("itensSelecionados deve ser um array");
    }

    const precos = {
      "Coleta de Dados + Criação e/ou Configuração de BM": 79.90,
      "Campanha Meta Ads": 378.90,
      "Campanha Google Ads": 478.90,
      "Copy para arte": 19.90,
      "Copy para carrossel": 39.90,
      "Copy para vídeo": 59.90,
      "Criativo arte": 39.90,
      "Criativo carrossel": 99.90,
      "Edição de vídeo": 119.90,
      "Relatório de métricas (mensal)": 44.90,
      "Copy para landing page": 249.90,
      "Criação de Landing Page": 1199.00
    };

    const items = itensSelecionados.map(i => ({
      title: i.nome,
      quantity: i.quantidade,
      unit_price: precos[i.nome] || 0,
      currency_id: "BRL"
    }));

    const body = {
      items,
      payer: {
        name: nome,
        email: email,
        identification: { type: "CPF", number: cpf },
        phone: { area_code: "11", number: (telefone || '').replace(/\D/g, '') }
      },
      back_urls: {
        success: "https://xbedigital.com/obrigado",
        failure: "https://xbedigital.com/erro",
        pending: "https://xbedigital.com/pending"
      },
      auto_return: "approved",
      payment_methods: { excluded_payment_types: [], excluded_payment_methods: [] }
    };

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Authorization": "Bearer APP_USR-3067856257757616-032416-34d4191b42d56349c5d19b251a81b001-3289815927",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const mp = await response.json();

    if (!mp.init_point) throw new Error(JSON.stringify(mp));

    // REDIRECIONAMENTO DIRETO PARA O CHECKOUT
    res.writeHead(302, { Location: mp.init_point });
    res.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
