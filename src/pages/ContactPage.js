import React, { useState } from 'react';

const ContactPage = () => {
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Thanks! We will reply within 24 hours.');
  };

  return (
    <div className="page-shell space-y-10">
      <section className="card">
        <div className="pill mb-4">Contact</div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Let us help with your next order.</h1>
        <p className="text-slate-300 text-lg max-w-3xl">
          Reach out for recommendations, bulk pricing, or any order questions. Our team responds within one business day.
        </p>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-200">Full name</label>
                <input type="text" placeholder="Your name" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-200">Email</label>
                <input type="email" placeholder="you@example.com" required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-200">Topic</label>
              <select required>
                <option value="">Select a topic</option>
                <option>Order support</option>
                <option>Bulk or corporate</option>
                <option>Partnerships</option>
                <option>General question</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-200">Message</label>
              <textarea rows="5" placeholder="Tell us how we can help..." required></textarea>
            </div>
            <button type="submit" className="btn-primary">Send message</button>
            {status && <p className="text-sm text-slate-300">{status}</p>}
          </form>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-bold text-white mb-2">Contact details</h3>
            <p className="text-slate-300">Email: support@fareedbookshop.com</p>
            <p className="text-slate-300">Phone: +961 1 555 426</p>
            <p className="text-slate-300">Address: Beirut, Lebanon</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-bold text-white mb-2">Hours</h3>
            <p className="text-slate-300">Mon - Fri: 9:00 - 18:00</p>
            <p className="text-slate-300">Sat: 10:00 - 16:00</p>
            <p className="text-slate-300">Sun: Closed</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-bold text-white mb-2">Follow</h3>
            <p className="text-slate-300">Instagram: @fareedbookshop</p>
            <p className="text-slate-300">LinkedIn: Fareed Bookshop</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
