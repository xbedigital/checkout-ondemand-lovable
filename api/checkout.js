import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Método não permitido");

  try {
    const { nome, email, cpf, telefone, itensSelecionados } = JSON.parse(req.body.payload);

    // Formata itens para o Mercado Pago
    const itemsMP = itensSelecionados.map(i => ({
      title: i.nome,
      quantity: i.quantidade,
      unit_price: Math.round((i.valor + (i.adicional || 0)) * 100) / 100,
      currency_id: "BRL",
    }));

    // Cria a preferência de pagamento
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
    // Métodos não permitidos
    res.status(405).json({ error: 'Método não permitido' });
  }
}
