// server.js - This is our MAIN RECIPE!

// Import ingredients (like opening spice boxes)
const express = require('express');
const mongoose = require('mongoose');
const twilio = require('twilio');
require('dotenv').config();

// Create our cooking pot (app)
const app = express();
app.use(express.json()); // This lets us read JSON recipes

// Connect to our digital notebook (MongoDB)
mongoose.connect('mongodb://localhost:27017/jewelry-shop', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("📦 Connected to MongoDB - Our Digital Notebook!"))
.catch(err => console.log("❌ Oops! Couldn't connect to notebook:", err));

// Define what an "Order" looks like
const orderSchema = new mongoose.Schema({
    customerName: String,
    mobileNumber: String,
    jewelryType: String,
    orderDetails: String,
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// Setup Twilio (our WhatsApp messenger)
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const client = twilio(accountSid, authToken);

// The MAGIC RECIPE: What happens when someone submits form
app.post('/api/orders', async (req, res) => {
    try {
        console.log("📝 Someone is placing an order!");
        
        // 1. Save order to our notebook
        const newOrder = new Order(req.body);
        await newOrder.save();
        console.log("✅ Order saved in notebook!");
        
        // 2. Send WhatsApp message
        const whatsappNumber = `whatsapp:${req.body.mobileNumber}`;
        const message = await client.messages.create({
            body: `✨ Hello ${req.body.customerName}! ✨\n\nThank you for considering our jewelry shop! 💎\nYour "${req.body.jewelryType}" order has been placed successfully!\n\nWe will contact you soon with more details.\n\nBest wishes,\n💎 Jewelry Palace Team`,
            from: 'whatsapp:+14155238886', // Twilio's number
            to: whatsappNumber
        });
        
        console.log("📱 WhatsApp message sent!");
        
        // 3. Send success message back to website
        res.json({
            success: true,
            message: "Order placed and WhatsApp sent! 🎉",
            orderId: newOrder._id
        });
        
    } catch (error) {
        console.log("❌ Oops! Something went wrong:", error);
        res.status(500).json({ error: error.message });
    }
});

// Start our kitchen on port 5000
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Backend kitchen is running on port ${PORT}`);
    console.log(`🍳 Ready to cook some orders!`);
});