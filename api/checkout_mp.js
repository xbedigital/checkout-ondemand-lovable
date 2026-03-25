import mercadopago from 'mercadopago';

// Configure seu Access Token do Mercado Pago
mercadopago.configurations.setAccessToken('APP_USR-3067856257757616-032416-34d4191b42d56349c5d19b251a81b001-3289815927');

export default async function handler(req, res) {
  // Permitir que sua LP Lovable faça requisições
  res.setHeader('Access-Control-Allow-Origin', 'https://xbedigital.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { nome, email, cpf, telefone, itens } = req.body;

      // Cria array de itens para o Mercado Pago
      const mp_items = itens.map(item => ({
        title: item.nome,
        quantity: item.quantidade,
        unit_price: item.valor / 100, // valor em reais
        currency_id: 'BRL'
      }));

      // Cria preferência de pagamento
      const preference = {
        items: mp_items,
        payer: {
          name: nome,
          email: email,
          identification: { type: 'CPF', number: cpf },
          phone: { area_code: '11', number: telefone.replace(/\D/g,'') }
        },
        back_urls: {
          success: 'https://xbedigital.com/obrigado',
          failure: 'https://xbedigital.com/erro',
          pending: 'https://xbedigital.com/pending'
        },
        auto_return: 'approved'
      };

      // Cria o link de checkout oficial
      const response = await mercadopago.preferences.create(preference);

      // Retorna o link para o frontend
      res.status(200).json({ success: true, init_point: response.body.init_point });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
