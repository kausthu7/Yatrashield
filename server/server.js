require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'YOUR_TEST_KEY_ID',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_TEST_KEY_SECRET',
});

// Route to create a new order
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, receipt } = req.body;
    
    // Amount must be in the smallest currency unit (paise for INR). 
    // Example: For ₹100, amount should be 10000.
    const options = {
      amount: amount * 100, 
      currency: "INR",
      receipt: receipt || `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    
    if (!order) {
      return res.status(500).json({ success: false, message: 'Failed to create order' });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Route to verify the payment signature
app.post('/api/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'YOUR_TEST_KEY_SECRET')
    .update(sign.toString())
    .digest("hex");

  if (razorpay_signature === expectedSign) {
    // Payment is verified
    return res.json({ success: true, message: "Payment verified successfully" });
  } else {
    return res.status(400).json({ success: false, message: "Invalid signature sent!" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend Server is running on port ${PORT}`);
});
