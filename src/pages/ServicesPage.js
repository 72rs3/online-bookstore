import React from 'react';

const ServicesPage = () => {
  const services = [
    {
      title: 'Curated collections',
      detail: 'Hand-picked lists across genres, themes, and trends so discovery feels effortless.'
    },
    {
      title: 'Fast delivery',
      detail: 'Reliable dispatch windows with tracking and careful packaging on every order.'
    },
    {
      title: 'Gift-ready options',
      detail: 'Personal notes, elegant wrapping, and direct-to-recipient delivery.'
    },
    {
      title: 'Bulk & corporate orders',
      detail: 'Dedicated support for schools, offices, and community programs.'
    }
  ];

  const steps = [
    { title: 'Explore', detail: 'Browse curated shelves or search by author and theme.' },
    { title: 'Checkout', detail: 'Secure payment flow with clear totals and confirmations.' },
    { title: 'Receive', detail: 'Fast delivery with updates at every step.' }
  ];

  return (
    <div className="page-shell space-y-12">
      <section className="card">
        <div className="pill mb-4">Services</div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Everything you need for a premium reading experience.</h1>
        <p className="text-slate-300 text-lg max-w-3xl">
          We focus on quality, speed, and delight. Whether you are buying for yourself or outfitting a team,
          our services are built for confidence and convenience.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <div key={service.title} className="card">
            <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
            <p className="text-slate-300">{service.detail}</p>
          </div>
        ))}
      </section>

      <section className="card">
        <h2 className="text-2xl font-bold text-white mb-6">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div key={step.title} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400 mb-2">Step {index + 1}</p>
              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-slate-300">{step.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-xl font-bold text-white mb-2">Support you can trust</h3>
          <p className="text-slate-300">
            We reply within 24 hours and provide proactive updates on every order. Your experience matters.
          </p>
        </div>
        <div className="card">
          <h3 className="text-xl font-bold text-white mb-2">Returns made simple</h3>
          <p className="text-slate-300">
            Changed your mind? Request a return within 14 days and we will guide you through the process.
          </p>
        </div>
      </section>

      <section className="card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Need a custom quote?</p>
          <h3 className="text-2xl font-bold text-white">Ask about bulk and corporate orders.</h3>
        </div>
        <a href="/contact" className="btn-primary">Contact sales</a>
      </section>
    </div>
  );
};

export default ServicesPage;
