import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const VENICE_API_KEY = process.env.VENICE_API_KEY || 'mock-key-for-testing';
const SELLER_ADDRESS = process.env.SELLER_PAYOUT_ADDRESS || '0x5990612e81a78a6648eb6e324df8421bcf7e9738';

// Initialize Venice AI client
const venice = new OpenAI({
  apiKey: VENICE_API_KEY,
  baseURL: 'https://api.venice.ai/api/v1',
});

// Check if we're using real API or mock
const isMockMode = VENICE_API_KEY === 'nv-mock-key-for-hackathon-testing-vortex' || VENICE_API_KEY === 'mock-key-for-testing';

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'active', 
    mode: isMockMode ? 'mock' : 'real',
    message: 'Venice AI Agent is running',
    timestamp: new Date().toISOString()
  });
});

// Main agent intelligence endpoint
app.get('/api/agent/reason', async (req, res) => {
  const { query } = req.query;
  const prompt = query || 'State the current status of the Vortex Agentic Pay system.';
  
  console.log(`[Agent] Processing request with prompt: ${prompt}`);
  
  try {
    let agentResponse;
    
    if (isMockMode) {
      // Mock response for testing without API key
      agentResponse = `Vortex Agent Active | EIP-7702 Smart Account Ready | x402 Payment System Online | Mode: Mock`;
      console.log('[Agent] Using mock response');
    } else {
      // Real Venice AI call
      const response = await venice.chat.completions.create({
        model: 'llama-3.3-70b',
        messages: [
          { 
            role: 'system', 
            content: 'You are Vortex Agentic Pay AI assistant. You help users with smart account operations, x402 payments, and onchain transactions. Keep responses concise and under 50 words.' 
          },
          { 
            role: 'user', 
            content: prompt 
          }
        ],
        max_tokens: 150,
        temperature: 0.7,
      });
      agentResponse = response.choices[0].message.content;
      console.log('[Agent] Real Venice AI response received');
    }
    
    res.json({ 
      success: true, 
      agentResponse,
      mode: isMockMode ? 'mock' : 'real',
      sellerAddress: SELLER_ADDRESS,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('[Agent] Venice AI error:', error);
    // Fallback response
    res.json({ 
      success: true, 
      agentResponse: 'Vortex Agent Active | EIP-7702 Smart Account Ready | x402 Payment System Online | Using Fallback Mode',
      mode: 'fallback',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Command endpoint for custom agent actions
app.post('/api/agent/command', async (req, res) => {
  const { command, context } = req.body;
  
  if (!command) {
    return res.status(400).json({ error: 'Command is required' });
  }
  
  console.log(`[Agent] Command received: ${command}`);
  
  try {
    let response;
    
    if (isMockMode) {
      response = `Command "${command}" received. Agent is ready. Smart Account: Active. x402: Online.`;
    } else {
      const aiResponse = await venice.chat.completions.create({
        model: 'llama-3.3-70b',
        messages: [
          { 
            role: 'system', 
            content: 'You are a helpful crypto assistant. Respond to the user\'s command briefly and accurately.' 
          },
          { 
            role: 'user', 
            content: `Context: ${JSON.stringify(context || {})}\nCommand: ${command}` 
          }
        ],
        max_tokens: 200,
      });
      response = aiResponse.choices[0].message.content;
    }
    
    res.json({ 
      success: true, 
      response,
      mode: isMockMode ? 'mock' : 'real'
    });
    
  } catch (error) {
    console.error('[Agent] Command error:', error);
    res.json({ 
      success: true, 
      response: `Command "${command}" received. Agent active but Venice API temporarily unavailable.`,
      mode: 'fallback'
    });
  }
});

// Agent status endpoint
app.get('/api/agent/status', (req, res) => {
  res.json({
    status: 'active',
    mode: isMockMode ? 'mock' : 'real',
    capabilities: [
      'EIP-7702 Smart Accounts',
      'ERC-7715 Advanced Permissions',
      'x402 Micro-payments',
      'A2A Coordination',
      'Venice AI Integration'
    ],
    sellerAddress: SELLER_ADDRESS,
    network: 'Base Sepolia'
  });
});

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════════╗
║                    VENICE AI AGENT ACTIVE                         ║
╠═══════════════════════════════════════════════════════════════════╣
║  Port: ${PORT}                                                       ║
║  Mode: ${isMockMode ? 'MOCK MODE' : 'REAL API'}                                         ║
║  Seller Address: ${SELLER_ADDRESS.slice(0, 10)}...                          ║
║  Status: Ready for EIP-7702 & x402                                 ║
╚═══════════════════════════════════════════════════════════════════╝
  `);
});