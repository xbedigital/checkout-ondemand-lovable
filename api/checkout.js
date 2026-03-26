import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Método não permitido");

  try {
    const { nome, email, cpf, telefone, itensSelecionados } = JSON.parse(req.body.payload);

    if (!itensSelecionados || itensSelecionados.length === 0) {
      return res.status(400).json({ error: "Nenhum item selecionado" });
    }

    // Mapear os valores de cada serviço automaticamente
    const getValor = (nome) => {
      switch(nome) {
        case "Coleta de Dados + Criação e/ou Configuração de BM, Página Comercial e Conta de Anúncio": return 79.90;
        case "Campanha Meta Ads": return 378.90;
        case "Campanha Google Ads": return 478.90;
        case "Copy para arte": return 19.90;
        case "Copy para carrossel": return 39.90;
        case "Copy para vídeo": return 59.90;
        case "Criativo arte": return 39.90;
        case "Criativo carrossel": return 99.90;
        case "Edição de vídeo": return 119.90;
        case "Relatório de métricas (mensal)": return 44.90;
        case "Copy para landing page": return 249.90;
        case "Criação de Landing Page": return 1199.00;
        default: return 0;
      }
    };

    const itemsMP = itensSelecionados.map(i => ({
      title: i.nome,
      quantity: i.quantidade,
      unit_price: getValor(i.nome),
      currency_id: "BRL"
    }));

    const preference = {
      payer: {
        name: nome,
        email: email,
        identification: { type: "CPF", number: cpf },
        phone: { number: telefone }
      },
      items: itemsMP,
      payment_methods: {
        excluded_payment_types: [],
        installments: 12,
      },
      back_urls: {
        success: "https://xbedigital.com/sucesso",
        failure: "https://xbedigital.com/erro",
        pending: "https://xbedigital.com/pendente",
      },
      auto_return: "approved",
      notification_url: "https://checkout-ondemand-lovable.vercel.app/api/notificacao",
    };

    const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: "Bearer APP_USR-3067856257757616-032416-34d4191b42d56349c5d19b251a81b001-3289815927",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(preference)
    });

    const data = await mpResponse.json();

    if (data.init_point) {
      return res.status(200).json({ init_point: data.init_point });
    } else {
      return res.status(500).json({ error: "Erro ao criar preferência no Mercado Pago", details: data });
    }

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
