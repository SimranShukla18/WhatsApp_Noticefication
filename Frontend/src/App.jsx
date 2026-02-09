// App.js - Our beautiful restaurant dining area!

import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // These are like empty boxes waiting to be filled
  const [formData, setFormData] = useState({
    customerName: '',
    mobileNumber: '',
    jewelryType: '',
    orderDetails: ''
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // When someone types in a box
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // When someone clicks SUBMIT button
  const handleSubmit = async (e) => {
    e.preventDefault(); // Don't refresh the page!
    setLoading(true);
    setMessage('');

    try {
      // Send the order to our kitchen (backend)
      const response = await axios.post('http://localhost:5000/api/orders', formData);
      
      if (response.data.success) {
        setMessage('🎉 Order placed successfully! Check WhatsApp!');
        // Clear the form
        setFormData({
          customerName: '',
          mobileNumber: '',
          jewelryType: '',
          orderDetails: ''
        });
      }
    } catch (error) {
      setMessage('❌ Oops! Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="jewelry-form">
        {/* HEADER - Like a restaurant sign */}
        <div className="header">
          <h1>💎 Jewelry Palace 💎</h1>
          <p>Order your dream jewelry with us!</p>
        </div>

        {/* ORDER FORM - Like a menu card */}
        <form onSubmit={handleSubmit}>
          {/* NAME BOX */}
          <div className="form-group">
            <label>Your Name:</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          {/* PHONE BOX */}
          <div className="form-group">
            <label>WhatsApp Number:</label>
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
              placeholder="+919876543210 (with country code)"
            />
            <small>Include country code (e.g., +91 for India, +1 for USA)</small>
          </div>

          {/* JEWELRY TYPE BOX */}
          <div className="form-group">
            <label>Jewelry Type:</label>
            <select
              name="jewelryType"
              value={formData.jewelryType}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Jewelry Type --</option>
              <option value="Necklace">💎 Necklace</option>
              <option value="Earrings">✨ Earrings</option>
              <option value="Bracelet">🔗 Bracelet</option>
              <option value="Ring">💍 Ring</option>
              <option value="Custom">🎨 Custom Design</option>
            </select>
          </div>

          {/* DETAILS BOX */}
          <div className="form-group">
            <label>Order Details:</label>
            <textarea
              name="orderDetails"
              value={formData.orderDetails}
              onChange={handleChange}
              rows="4"
              placeholder="Tell us about your design preferences, material (gold/silver), budget, etc."
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Placing Order...
              </>
            ) : (
              '✨ Place Order & Send WhatsApp ✨'
            )}
          </button>

          {/* MESSAGE DISPLAY */}
          {message && (
            <div className={`message ${message.includes('🎉') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
        </form>

        {/* FOOTER - Like restaurant info */}
        <div className="footer">
          <p>📱 You'll receive a WhatsApp confirmation immediately!</p>
          <p>⏰ We'll contact you within 24 hours</p>
        </div>
      </div>
    </div>
  );
}

export default App;