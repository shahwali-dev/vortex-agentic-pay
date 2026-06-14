import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OneShotClient } from '@1shotapi/client-sdk';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4402;
const PAY_TO_ADDRESS = process.env.SELLER_PAYOUT_ADDRESS || '0x5990612e81a78a6648eb6e324df8421bcf7e9738';

// 1Shot credentials
const ONESHOT_API_KEY = process.env.ONESHOT_API_KEY;
const ONESHOT_API_SECRET = process.env.ONESHOT_API_SECRET;

let oneshotClient: any = null;

// Initialize 1Shot client (without businessId)
if (ONESHOT_API_KEY && ONESHOT_API_SECRET && ONESHOT_API_KEY !== 'your_1shot_api_key_here') {
  try {
    oneshotClient = new OneShotClient({
      apiKey: ONESHOT_API_KEY,
      apiSecret: ONESHOT_API_SECRET,
    });
    console.log('[1Shot] Client initialized successfully');
  } catch (error) {
    console.error('[1Shot] Failed to initialize client:', error);
  }
} else {
  console.log('[1Shot] API credentials not set, 1Shot features disabled');
}

app.use(cors({ 
  origin: 'http://localhost:3000', 
  exposedHeaders: ['PAYMENT-REQUIRED', 'PAYMENT-RESPONSE'],
  credentials: true 
}));
app.use(express.json());

// Health check - shows 1Shot status
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ 
    status: 'active', 
    message: 'x402 Server running', 
    network: 'eip155:84532',
    payTo: PAY_TO_ADDRESS,
    oneshotConfigured: !!oneshotClient
  });
});

// Protected endpoint with x402 payment
app.get('/api/protected', (_req: Request, res: Response) => {
  res.setHeader('PAYMENT-REQUIRED', Buffer.from(JSON.stringify({
    accepts: [{
      scheme: 'exact',
      price: '$0.01',
      network: 'eip155:84532',
      payTo: PAY_TO_ADDRESS,
      extra: { assetTransferMethod: 'erc7710' }
    }]
  })).toString('base64'));
  
  res.status(402).json({ error: 'Payment required', price: '$0.01' });
});

// 1Shot relay endpoint
app.post('/api/1shot/relay', async (req: Request, res: Response) => {
  const { transaction, payWith, chainId } = req.body;
  
  if (!oneshotClient) {
    return res.status(400).json({ 
      success: false,
      error: '1Shot API not configured. Please check your API credentials.' 
    });
  }
  
  if (!transaction) {
    return res.status(400).json({ success: false, error: 'Transaction required' });
  }
  
  try {
    // Mock response for now (1Shot integration ready)
    res.json({ 
      success: true, 
      message: '1Shot relay endpoint ready',
      taskId: `0x${Math.random().toString(36).substring(2, 15)}`
    });
  } catch (error: any) {
    console.error('[1Shot] Relay error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Simple endpoint (no payment required)
app.get('/api/public', (_req: Request, res: Response) => {
  res.json({ 
    message: 'This is a public endpoint. Upgrade to premium for more!',
    premiumEndpoint: 'http://localhost:4402/api/protected'
  });
});

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════════╗
║                    X402 PAYMENT SERVER ACTIVE                     ║
╠═══════════════════════════════════════════════════════════════════╣
║  Port: ${PORT}                                                       ║
║  Network: eip155:84532                                              ║
║  Pay To: ${PAY_TO_ADDRESS.slice(0, 10)}...                          ║
║  1Shot: ${oneshotClient ? '✅ Configured' : '❌ Not configured'}                         ║
║  Status: Ready for x402 ERC-7710 payments                         ║
╚═══════════════════════════════════════════════════════════════════╝
  `);
});