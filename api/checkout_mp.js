import mercadopago from 'mercadopago';

mercadopago.configurations.setAccessToken('APP_USR-3067856257757616-032416-34d4191b42d56349c5d19b251a81b001-3289815927');

export default async function handler(req, res) {

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {

    // 🔥 AGORA FUNCIONA COM GET E POST
    const data = req.method === 'POST' ? req.body : req.query;

    const { nome, email, cpf, telefone } = data;

    // Itens fixos (podemos melhorar depois)
    const items = [
      {
        title: 'Serviço LP',
        quantity: 1,
        unit_price: 79.90,
        currency_id: 'BRL'
      }
    ];

    const preference = {
      items,
      payer: {
        name: nome,
        email: email,
        identification: {
          type: 'CPF',
          number: cpf
        },
        phone: {
          area_code: '11',
          number: (telefone || '').replace(/\D/g, '')
        }
      },
      back_urls: {
        success: 'https://xbedigital.com/obrigado',
        failure: 'https://xbedigital.com/erro',
        pending: 'https://xbedigital.com/pending'
      },
      auto_return: 'approved'
    };

    const response = await mercadopago.preferences.create(preference);

    // 🔥 REDIRECIONA DIRETO (IMPORTANTE)
    res.writeHead(302, {
      Location: response.body.init_point
    });
    res.end();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
