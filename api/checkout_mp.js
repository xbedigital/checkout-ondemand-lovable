export default async function handler(req, res) {
  try {
    const data = req.method === 'POST' ? req.body : req.query;

    const { nome, email, cpf, telefone } = data;

    const body = {
      items: [
        {
          title: "Serviço LP",
          quantity: 1,
          currency_id: "BRL",
          unit_price: 79.9
        }
      ],
      payer: {
        name: nome,
        email: email,
        identification: {
          type: "CPF",
          number: cpf
        }
      },
      back_urls: {
        success: "https://xbedigital.com/obrigado",
        failure: "https://xbedigital.com/erro",
        pending: "https://xbedigital.com/pending"
      },
      auto_return: "approved"
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

    if (!mp.init_point) {
      throw new Error(JSON.stringify(mp));
    }

    // 🔥 REDIRECIONAMENTO DIRETO
    res.writeHead(302, {
      Location: mp.init_point
    });
    res.end();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
