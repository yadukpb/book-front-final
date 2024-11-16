import React, { useState } from "react";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaGooglePay } from "react-icons/fa";
import { SiPhonepe } from "react-icons/si";
import { BsCreditCard2Front, BsQrCode } from "react-icons/bs";
import './CSS/payment.css';

const Payment = ({ amount, onSuccess, onClose, sellerId, bookId }) => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast.error("Please select a payment method");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error("Please login to continue");
        navigate('/auth');
        return;
      }

      // Create payment first
      const paymentResponse = await fetch('http://localhost:5007/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bookId,
          sellerId,
          amount,
          paymentMethod: selectedMethod
        })
      });

      const paymentData = await paymentResponse.json();

      if (!paymentResponse.ok) {
        throw new Error(paymentData.message || 'Payment failed');
      }

      // Create purchase record
      const purchaseResponse = await fetch('http://localhost:5007/api/purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bookId,
          sellerId,
          amount,
          paymentId: paymentData.paymentId,
          status: 'completed'
        })
      });

      const purchaseData = await purchaseResponse.json();

      if (!purchaseResponse.ok) {
        throw new Error(purchaseData.message || 'Failed to record purchase');
      }

      onSuccess();
      toast.success("Payment successful!");
      onClose();
      navigate(`/chat/${sellerId}`);
    } catch (error) {
      console.error('Payment/Purchase error:', error);
      toast.error(error.message || "Transaction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { id: "phonepe", name: "PhonePe", icon: SiPhonepe },
    { id: "googlepay", name: "Google Pay", icon: FaGooglePay },
    { id: "upi", name: "UPI ID", icon: BsCreditCard2Front },
  ];

  return (
    <div className="payment-overlay">
      <div className="payment-modal">
        <div className="payment-header">
          <h2>Complete Payment</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="payment-amount">
          <span>Amount to Pay:</span>
          <span className="amount">₹{amount.toFixed(2)}</span>
        </div>

        <div className="payment-methods">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`payment-method ${selectedMethod === method.id ? "selected" : ""}`}
              onClick={() => setSelectedMethod(method.id)}
            >
              {React.createElement(method.icon, { size: 24 })}
              <span>{method.name}</span>
            </div>
          ))}
        </div>

        <div className="qr-section">
          <BsQrCode size={150} />
          <p>Scan QR code to pay</p>
        </div>

        <button 
          className="pay-button" 
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </div>
  );
};

export default Payment;