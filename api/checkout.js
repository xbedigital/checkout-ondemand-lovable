import mercadopago from 'mercadopago';

// Configuração Mercado Pago
mercadopago.configurations.setAccessToken('APP_USR-3067856257757616-032416-34d4191b42d56349c5d19b251a81b001-3289815927');

export default async function handler(req, res) {
  // === CORS ===
  res.setHeader('Access-Control-Allow-Origin', '*'); // Permite requisições de qualquer origem
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { token, email, amount } = req.body; // dados recebidos do frontend

      // Criar pagamento no Mercado Pago
      const payment_data = {
        transaction_amount: amount / 100, // valor em reais
        token: token,
        description: 'Compra na LP',
        installments: 1,
        payment_method_id: 'visa', // para cartão, pode mudar dinamicamente
        payer: {
          email: email
        }
      };

      const payment = await mercadopago.payment.save(payment_data);

      // Retorno para o frontend
      res.status(200).json({ success: true, payment });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
