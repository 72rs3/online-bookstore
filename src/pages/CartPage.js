import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, updateQty, removeFromCart, clearCart } from '../utils/cart';

const CartPage = () => {
  const [items, setItems] = useState([]);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setItems(getCart());
  }, []);

  const subtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.qty || 0), 0);

  const handleCheckout = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert('Please login to checkout');
      navigate('/login');
      return;
    }
    if (items.length === 0) return;

    setProcessing(true);
    // Create a Tap charge for the subtotal and open hosted page in a new tab to keep the cart page intact.
    try {
      const payload = {
        amount: Number(subtotal.toFixed(2)),
        currency: 'KWD',
        customer: {
          first_name: user.username || 'Customer',
          last_name: '',
          email: user.email || 'customer@example.com',
        },
        reference: { order: `order_${Date.now()}` },
        description: 'Book order'
      };

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/payments/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.error ? JSON.stringify(data.error) : 'Payment failed to start');
        setProcessing(false);
        return;
      }

      const redirectUrl = data.transaction?.url || data.redirect?.url;
      if (redirectUrl) {
        window.open(redirectUrl, '_blank', 'noopener');
      } else {
        alert('Charge created. No redirect URL returned.');
      }
    } catch (err) {
      console.error(err);
      alert('Payment error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="page-shell max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Checkout</p>
          <h2 className="text-3xl font-extrabold text-white">Your Cart</h2>
        </div>
        <button className="text-sm text-slate-300 underline" onClick={() => { clearCart(); setItems([]); }}>
          Clear cart
        </button>
      </div>

      {items.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-slate-300 mb-4">Your cart is empty.</p>
          <button onClick={() => navigate('/')} className="btn-primary">Browse books</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.id} className="card flex items-center gap-4">
                <img src={item.coverImage || 'https://via.placeholder.com/80x120?text=No+Cover'} alt={item.title} className="w-16 h-20 object-cover rounded-lg" />
                <div className="flex-1">
                  <p className="text-white font-bold">{item.title}</p>
                  <p className="text-slate-400 text-sm">{item.author}</p>
                  <p className="text-slate-200 font-semibold mt-1">
                    {isNaN(Number(item.price)) ? '$—' : `$${Number(item.price).toFixed(2)}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-2 py-1 bg-white/10 rounded" onClick={() => { setItems(updateQty(item.id, (item.qty || 1) - 1)); }}>-</button>
                  <input
                    type="number"
                    min="1"
                    value={item.qty || 1}
                    onChange={(e) => setItems(updateQty(item.id, Number(e.target.value) || 1))}
                    className="w-14 text-center bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                  <button className="px-2 py-1 bg-white/10 rounded" onClick={() => { setItems(updateQty(item.id, (item.qty || 1) + 1)); }}>+</button>
                </div>
                <button className="text-rose-300 hover:text-rose-200" onClick={() => setItems(removeFromCart(item.id))}>
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="card space-y-4">
            <h3 className="text-xl font-bold text-white">Order Summary</h3>
            <div className="flex justify-between text-slate-300">
              <span>Subtotal</span>
              <span>{isNaN(subtotal) ? '$—' : `$${subtotal.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-slate-400 text-sm">
              <span>Taxes & shipping</span>
              <span>Calculated at payment</span>
            </div>
            <hr className="border-white/10" />
            <div className="flex justify-between text-white font-bold text-lg">
              <span>Total</span>
              <span>{isNaN(subtotal) ? '$—' : `$${subtotal.toFixed(2)}`}</span>
            </div>
            <button
              className="btn-primary w-full"
              onClick={handleCheckout}
              disabled={processing || items.length === 0}
            >
              {processing ? 'Processing…' : 'Proceed to Payment'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
