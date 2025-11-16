require('dotenv').config();
const express = require('express');
const { useX402 } = require('@x402sdk/sdk');  // x402 middleware
const { x402Fetch } = require('@bankr/sdk');  // Payment handling

const app = express();
app.use(express.json());

// Enable CORS for WooCommerce calls
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Paid API endpoint for WooCommerce (e.g., premium product data)
const mintConfig = {
  network: 'base',  // Or 'solana' for devnet
  price: '0.01',  // USDC amount ($0.01 micropayment)
  description: 'Access premium product recommendations',
  payTo: process.env.WALLET_ADDRESS
};

app.get('/premium-products', (req, res, next) => {
  useX402(req, res, next, mintConfig, process.env.FACILITATOR_URL);
}, async (req, res) => {
  try {
    const prompt = 'Generate 5 premium product suggestions for WooCommerce shop';
    const response = await x402Fetch(prompt, { privateKey: process.env.PRIVATE_KEY });
    res.json({ suggestions: response });  // Send to WooCommerce
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`x402 Service running on port ${port}`));
